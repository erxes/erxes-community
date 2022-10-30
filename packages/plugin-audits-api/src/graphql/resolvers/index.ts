import customScalars from '@erxes/api-utils/src/customScalars';

import {
  queries as riskAssessmentQueries,
  mutations as riskAssessmentMutations
} from './riskAssessments';
import { queries as operationQueries, mutations as operationMutations } from './operations';

import RiskConformity from '../../dataloaders/riskAssessments/resolvers/riskConformities';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,

  RiskConformity,

  Mutation: {
    ...riskAssessmentMutations,
    ...operationMutations
  },
  Query: {
    ...riskAssessmentQueries,
    ...operationQueries
  }
});

export default resolvers;
