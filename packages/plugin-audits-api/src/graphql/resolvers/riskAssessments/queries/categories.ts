import { IContext } from '../../../../connectionResolver';
import { IRiskAssessmentCategoriesField } from '../../../../common/types/riskAssessment';

const RiskAssessmentsCategoryQueries = {
  async riskAssesmentCategories(_root, params: IRiskAssessmentCategoriesField, { models }: IContext) {
    return await models.RiskAssessmentCategories.getCategories(params);
  },
  async riskAssesmentCategory(_root, _id: string, { models }: IContext) {
    return await models.RiskAssessmentCategories.getCategory(_id);
  },

  async getRiskAssessmentFormDetail(_root, { _id }, { models }: IContext) {
    return await models.RiskAssessmentCategories.getFormDetail(_id);
  }
};

export default RiskAssessmentsCategoryQueries;
