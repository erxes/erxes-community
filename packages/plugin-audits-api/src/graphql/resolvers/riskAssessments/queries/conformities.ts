import { IContext } from '../../../../connectionResolver';
import { IRiskConformitiesParams } from '../../../../common/types/riskAssessment';

const RiskConformityQuries = {
  async riskConformities(_root, params: IRiskConformitiesParams, { models }: IContext) {
    return await models.RiskConformities.riskConformities(params);
  },
  async riskConformityDetails(_root, params: IRiskConformitiesParams, { models }: IContext) {
    return await models.RiskConformities.riskConformityDetails(params);
  },
  async riskConformitySubmissions(_root, params: { cardId: string }, { models }: IContext) {
    return await models.RiskConformities.riskConformitySubmissions(params);
  },

  async riskConformityFormDetail(_root, params, { models }: IContext) {
    return await models.RiskConformities.riskConformityFormDetail(params);
  }
};

export default RiskConformityQuries;
