import { Model } from 'mongoose';
import { IRCFAIssuesDocument, rcfaIssuessSchema } from './definitions/issues';
import { IModels } from '../connectionResolver';
import { IUserDocument } from '@erxes/api-utils/src/types';

export interface IRCFAQuestionModel extends Model<IRCFAIssuesDocument> {
  addIssue(doc: any, user: any): Promise<IRCFAIssuesDocument>;
  editIssue(_id: string, doc: any): Promise<IRCFAIssuesDocument>;
  removeIssue(_id: string): Promise<IRCFAIssuesDocument>;
}

export const loadRCFAIssuesClass = (models: IModels, subdomain: string) => {
  class Issues {
    public static async addIssue(doc: any, user: IUserDocument) {
      const { mainType, mainTypeId, parentId } = doc;

      const issueDoc = {
        ...doc
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

        const countIssues = await models.Issues.countDocuments({
          rcfaId: rcfa._id
        });

        if (countIssues === 5) {
          throw new Error('You cannot add issue this rcfa');
        }

        if (rcfa.userId !== user._id) {
          throw new Error('You cannot add issue this rcfa');
        }

        const parent = await models.Issues.findOne({
          rcfaId: rcfa._id
        }).sort({ createdAt: -1 });

        issueDoc.parentId = parent?._id;

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
