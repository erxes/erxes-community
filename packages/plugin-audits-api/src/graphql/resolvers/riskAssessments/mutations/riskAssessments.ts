import { IContext } from '../../../../connectionResolver';
import { IRiskAssessmentField } from '../../../../common/types/riskAssessment';

const RiskAssessmentMutations = {
  async addRiskAssesment(_root, params: IRiskAssessmentField, { models }: IContext) {
    const result = await models.RiskAssessments.riskAssesmentAdd(params);
    return result;
  },
  async removeRiskAssessment(_root, { _ids }, { models }: IContext) {
    const result = await models.RiskAssessments.riskAssesmentRemove(_ids);
    return result;
  },

  async updateRiskAssessment(_root, params: { _id: string; doc: IRiskAssessmentField }, { models }: IContext) {
    const result = await models.RiskAssessments.riskAssessmentUpdate(params);
    return result;
  }
};

export default RiskAssessmentMutations;
