import { IContext } from '../../../../connectionResolver';
import { IRiskAssessmentCategoriesField } from '../../../../common/types/riskAssessment';

const RiskAssessmentCategoryMutation = {
  async addAssessmentCategory(_root, params: IRiskAssessmentCategoriesField, { models }: IContext) {
    return await models.RiskAssessmentCategories.addCategory(params);
  },

  async removeAssessmentCategory(_root, params: { _id: string }, { models }: IContext) {
    return await models.RiskAssessmentCategories.removeCategory(params);
  },

  async editAssessmentCategory(_root, params: IRiskAssessmentCategoriesField, { models }: IContext) {
    return await models.RiskAssessmentCategories.editCategory(params);
  },
  async removeUnsavedRiskAssessmentCategoryForm(_root, { formId }: { formId: string }, { models }: IContext) {
    return await models.RiskAssessmentCategories.removeUnsavedRiskAssessmentCategoryForm(formId);
  }
};
export default RiskAssessmentCategoryMutation;
