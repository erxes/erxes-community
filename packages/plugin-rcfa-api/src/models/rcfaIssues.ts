import { Model } from 'mongoose';
import { IRCFAIssuesDocument, rcfaIssuessSchema } from './definitions/issues';
import { IModels } from '../connectionResolver';
import { IUserDocument } from '@erxes/api-utils/src/types';
import { sendCardsMessage } from '../messageBroker';

export interface IRCFAQuestionModel extends Model<IRCFAIssuesDocument> {
  addIssue(doc: any, user: any): Promise<IRCFAIssuesDocument>;
  editIssue(_id: string, doc: any): Promise<IRCFAIssuesDocument>;
  removeIssue(_id: string): Promise<IRCFAIssuesDocument>;
  closeRootIssue(_id: string): Promise<IRCFAIssuesDocument>;
  createActionRcfaRoot(params): Promise<IRCFAIssuesDocument>;
}

export const loadRCFAIssuesClass = (models: IModels, subdomain: string) => {
  class Issues {
    public static async addIssue(doc: any, user: IUserDocument) {
      const { mainType, mainTypeId, parentId } = doc;
      const parent = await models.Issues.findOne({ _id: parentId });

      const issueDoc = {
        ...doc,
        code: doc.issue,
        order: `${parent ? parent.order : ''}${doc.issue}/`
      };

      const rcfa = await models.RCFA.findOne({
        mainType,
        mainTypeId
      });

      if (!rcfa) {
        const rcfaDoc = {
          mainType,
          mainTypeId,
          userId: user._id
        };
        const newDoc = await models.RCFA.create(rcfaDoc);
        issueDoc.rcfaId = newDoc._id;
      } else {
        if (rcfa?.status !== 'inProgress') {
          throw new Error('RCFA is already in resolved');
        }

        const [{ status, countHierarchies }] = await models.Issues.aggregate([
          { $match: { _id: issueDoc?.parentId } },
          {
            $graphLookup: {
              from: 'rcfa_issues',
              startWith: '$parentId',
              connectFromField: 'parentId',
              connectToField: '_id',
              as: 'hierarchies'
            }
          },
          {
            $project: { status: 1, countHierarchies: { $size: '$hierarchies' } }
          }
        ]);
        if (countHierarchies === 4) {
          throw new Error('You cannot add issue this level of rcfa');
        }

        if (status !== 'inProgress') {
          throw new Error('You cannot add issue this level of rcfa');
        }
        if (rcfa.userId !== user._id) {
          throw new Error('You cannot add issue this rcfa');
        }

        issueDoc.rcfaId = rcfa._id;
      }

      return await models.Issues.create({ ...issueDoc });
    }

    public static async editIssue(_id, doc) {
      await this.checkStatus(_id);

      return await models.Issues.updateOne({ _id }, { $set: { ...doc } });
    }

    public static async removeIssue(_id) {
      await this.checkStatus(_id);
      const issue = await models.Issues.findOne({ _id });

      if (!issue?.parentId) {
        await models.RCFA.deleteOne({ _id: issue?.rcfaId });
      }

      return issue?.remove();
    }

    public static async closeRootIssue(_id) {
      const issueRoot = await models.Issues.findOne({ _id });

      if (!issueRoot) {
        throw new Error('Issue root not found');
      }

      return await models.Issues.updateMany(
        { order: { $regex: new RegExp(issueRoot.order, 'i') } },
        { $set: { status: 'closed', closedAt: new Date() } }
      );
    }

    public static async createActionRcfaRoot(params) {
      const { issueId, name } = params;
      if (!issueId || !name) {
        throw new Error('You should specify a issueID or name');
      }

      const issue = await models.Issues.findOne({ _id: issueId });
      if (!issue) {
        throw new Error('Issue Not Found');
      }

      const rcfa = await models.RCFA.findOne({ _id: issue?.rcfaId });

      const childItem = await sendCardsMessage({
        subdomain,
        action: 'createChildItem',
        data: {
          type: rcfa?.mainType,
          itemId: rcfa?.mainTypeId,
          name
        },
        isRPC: true
      });

      return await models.Issues.updateOne(
        { _id: issue?._id },
        { relTypeId: childItem._id, relType: rcfa?.mainType }
      );
    }

    public static async checkStatus(_id) {
      const issue = await models.Issues.findOne({ _id });

      const rcfa = await models.RCFA.findOne({ _id: issue?.rcfaId });

      if (rcfa?.status !== 'inProgress') {
        throw new Error(
          'You cannot remove a issue that is already in resolved'
        );
      }
    }
  }

  rcfaIssuessSchema.loadClass(Issues);

  return rcfaIssuessSchema;
};
