import { IContext } from '../../../../connectionResolver';
import { IRiskConformitiesField } from '../../../../common/types/riskAssessment';

const RiskConformityMutations = {
  async addRiskConformity(_root, params: IRiskConformitiesField, { models }: IContext) {
    return await models.RiskConformities.riskConformityAdd(params);
  },
  async updateRiskConformity(_root, params: IRiskConformitiesField, { models }: IContext) {
    return await models.RiskConformities.riskConformityUpdate(params);
  },
  async removeRiskConformity(_root, { cardId }: { cardId: string }, { models }: IContext) {
    return await models.RiskConformities.riskConformityRemove(cardId);
  }
};

export default RiskConformityMutations;
