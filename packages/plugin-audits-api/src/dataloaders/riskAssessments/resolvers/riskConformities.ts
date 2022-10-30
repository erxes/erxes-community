import { IRiskConformitiesDocument } from '../../../common/types/riskAssessment';
import { IContext } from '../../../connectionResolver';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.RiskAssessments.findOne({ _id });
  },

  async riskAssessment(riskConformity: IRiskConformitiesDocument, {}, { dataLoaders }: IContext) {
    return (riskConformity.riskAssessmentId && dataLoaders.riskAssessment.load(riskConformity.riskAssessmentId)) || null;
  }
};
