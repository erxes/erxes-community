import { IContext } from '../../../../connectionResolver';
import { IRiskAssessmentField, PaginateField } from '../../../../common/types/riskAssessment';

const RiskAssessmentQueries = {
  async riskAssessments(_root, params: { categoryId: string } & IRiskAssessmentField & PaginateField, { models }: IContext) {
    return await models.RiskAssessments.riskAssessments(params);
  },

  async riskAssessmentDetail(_root, params: { _id: string }, { models }: IContext) {
    return await models.RiskAssessments.riskAssessmentDetail(params);
  }
};

export default RiskAssessmentQueries;
