import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { IRiskConformityField } from '../../../models/definitions/common';

const RiskConfimityMutations = {
  async addRiskConformity(_root, params: IRiskConformityField, { models }: IContext) {
    return await models.RiskConfimity.riskConformityAdd(params);
  },
  async updateRiskConformity(_root, params: IRiskConformityField, { models }: IContext) {
    return await models.RiskConfimity.riskConformityUpdate(params);
  },
  async removeRiskConformity(_root, { cardId }: { cardId: string }, { models }: IContext) {
    return await models.RiskConfimity.riskConformityRemove(cardId);
  }
};

checkPermission(RiskConfimityMutations, 'addRiskConformity', 'manageRiskAssessment');
checkPermission(RiskConfimityMutations, 'updateRiskConformity', 'manageRiskAssessment');
checkPermission(RiskConfimityMutations, 'removeRiskConformity', 'manageRiskAssessment');

export default RiskConfimityMutations;
