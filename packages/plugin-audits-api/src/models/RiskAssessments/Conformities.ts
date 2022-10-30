import { Model } from 'mongoose';
import { IModels } from '../../connectionResolver';
import { sendCardsMessage, sendCoreMessage, sendFormsMessage } from '../../messageBroker';
import { calculateRiskAssessment } from '../../common/utils/riskAssessments';
import { IRiskConformitiesField, IRiskConformitiesParams, IRiskConformitiesDocument } from '../../common/types/riskAssessment';
import { riskConformitiesSchema } from '../definitions/riskAssessments/conformity';

export interface IRiskConformitiesModel extends Model<IRiskConformitiesDocument> {
  riskConformities(params: IRiskConformitiesParams): Promise<IRiskConformitiesDocument>;
  riskConformitySubmissions(params: { cardId: string }): Promise<IRiskConformitiesDocument>;
  riskConformityDetails(params: IRiskConformitiesParams): Promise<IRiskConformitiesDocument>;
  riskConformityAdd(params: IRiskConformitiesField): Promise<IRiskConformitiesDocument>;
  riskConformityUpdate(params: IRiskConformitiesParams): Promise<IRiskConformitiesDocument>;
  riskConformityRemove(cardId: string): Promise<IRiskConformitiesDocument>;
  riskConformityFormDetail(params): any;
}

const generateFilter = (params: IRiskConformitiesParams) => {
  let filter: any = {};

  if (params.cardId) {
    filter.cardId = params.cardId;
  }

  if (params.riskAssessmentId) {
    filter.riskAssessmentId = params.riskAssessmentId;
  }

  return filter;
};

export const loadRiskConformities = (model: IModels, subdomain: string) => {
  class RiskConfimities {
    public static async riskConformityAdd(params: IRiskConformitiesField) {
      return model.RiskConformities.create({ ...params });
    }
    public static async riskConformities(params: IRiskConformitiesParams) {
      const filter = generateFilter(params);
      return await model.RiskConformities.find(filter);
    }
    public static async riskConformityDetails(params: IRiskConformitiesParams) {
      const filter = generateFilter(params);

      const result = await model.RiskConformities.find(filter);

      return result;
    }

    public static async riskConformityUpdate(params: IRiskConformitiesParams) {
      const { cardId, riskAssessmentId, cardType } = params;

      if (!riskAssessmentId) {
        throw new Error('riskAssessmentId is required');
      }
      if (!cardId) {
        throw new Error('cardId is required');
      }

      const confimity = await model.RiskConformities.findOne({ cardId, cardType }).lean();

      if (!confimity) {
        throw new Error('Confimity not found');
      }

      return await model.RiskConformities.findOneAndUpdate({ _id: confimity._id }, { ...confimity, riskAssessmentId }, { new: true });
    }

    public static async riskConformityRemove(cardId: string) {
      if (!cardId) {
        throw new Error('cardId is required');
      }

      await model.RiskConformities.deleteOne({ cardId });
      return 'success';
    }

    public static async riskConformitySubmissions(params) {
      const { cardId, cardType } = params;

      if (!cardId) {
        throw new Error('card Id is required');
      }

      if (!(await model.RiskConformities.findOne({ cardId: cardId, cardType }))) {
        throw new Error('Not found selected risk assessment in card');
      }

      const { riskAssessmentId } = await model.RiskConformities.findOne({
        cardId: cardId,
        cardType
      }).lean();

      const assignedUsers = await this.getAsssignedUsers(cardId, cardType);
      const formId = await this.getFormId(cardId);

      for (const usr of assignedUsers) {
        const submissions = await model.RiksFormSubmissions.find({
          cardId: cardId,
          formId,
          userId: usr._id,
          riskAssessmentId
        });
        if (submissions.length > 0) {
          usr['isSubmittedRiskAssessmentForm'] = true;
        }
      }
      const { status } = await model.RiskAssessments.findOne({ _id: riskAssessmentId }).lean();

      if (status !== 'In Progress') {
        const assignedUserIds = assignedUsers.map(user => user._id);
        const submittedUsers = await model.RiksFormSubmissions.find({
          userId: { $in: assignedUserIds },
          riskAssessmentId,
          cardId: cardId,
          formId
        });
        const submittedUsersIds = [...new Set(submittedUsers.map(user => user.userId))];
        return assignedUsers.filter(user => submittedUsersIds.some(submission => submission === user._id));
      }

      return assignedUsers;
    }

    public static async riskConformityFormDetail(params) {
      const { cardId, userId, riskAssessmentId } = params;

      if (!cardId) {
        throw new Error('Card ID is required');
      }
      const { categoryId } = await model.RiskAssessments.findOne({ _id: riskAssessmentId }).lean();

      const { formId } = await model.RiskAssessmentCategories.findOne({ _id: categoryId }).lean();

      if (!formId) {
        throw new Error('Form ID is required');
      }

      const query = { contentType: 'form', contentTypeId: formId };
      const editedsubmissions = {};

      const fields = await sendFormsMessage({
        subdomain,
        action: 'fields.find',
        data: { query },
        isRPC: true,
        defaultValue: []
      });

      const submissions = await model.RiksFormSubmissions.find({
        cardId,
        formId,
        userId
      }).lean();

      for (const submission of submissions) {
        editedsubmissions[submission.fieldId] = submission.value;
      }

      return { fields, submissions: editedsubmissions, formId };
    }

    static async getAsssignedUsers(cardId: string, cardType: string) {
      let assignedUsers;
      const card = await sendCardsMessage({
        subdomain,
        action: `${cardType}s.findOne`,
        data: {
          _id: cardId
        },
        isRPC: true,
        defaultValue: []
      });

      if (card) {
        const { assignedUserIds } = card;

        assignedUsers = await sendCoreMessage({
          subdomain,
          action: 'users.find',
          data: {
            query: { _id: { $in: assignedUserIds } }
          },
          isRPC: true,
          defaultValue: []
        });
      }

      return assignedUsers;
    }

    static async getFormId(cardId: string) {
      const { riskAssessmentId } = await model.RiskConformities.findOne({ cardId }).lean();
      const { categoryId } = await model.RiskAssessments.findOne({ _id: riskAssessmentId }).lean();

      const { formId } = await model.RiskAssessmentCategories.findOne({ _id: categoryId }).lean();
      return formId;
    }
  }
  riskConformitiesSchema.loadClass(RiskConfimities);
  return riskConformitiesSchema;
};
