import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { IRiskConformityParams } from '../../../models/definitions/common';

const RiskConformityQuries = {
  async riskConformities(_root, params: IRiskConformityParams, { models }: IContext) {
    return await models.RiskConfimity.riskConformities(params);
  },
  async riskConformityDetails(_root, params: IRiskConformityParams, { models }: IContext) {
    return await models.RiskConfimity.riskConformityDetails(params);
  },
  async riskConformitySubmissions(_root, params: { cardId: string }, { models }: IContext) {
    return await models.RiskConfimity.riskConformitySubmissions(params);
  },

  async riskConformityFormDetail(_root, params, { models }: IContext) {
    return await models.RiskConfimity.riskConformityFormDetail(params);
  }
};

checkPermission(RiskConformityQuries, 'riskConformities', 'showRiskAssessment');
checkPermission(RiskConformityQuries, 'riskConformityDetails', 'showRiskAssessment');
checkPermission(RiskConformityQuries, 'riskConformitySubmissions', 'showRiskAssessment');
checkPermission(RiskConformityQuries, 'riskConformityFormDetail', 'showRiskAssessment');

export default RiskConformityQuries;
