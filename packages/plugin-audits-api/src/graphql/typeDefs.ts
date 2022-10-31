import { gql } from 'apollo-server-express';

import {
  mutations as riskFormSubmissionMutations,
  queries as riskFormSubmissionQueries,
  types as riskFormSubmissionTypes
} from '../graphql/schemas/riskAssessments//formSubmissions';
import {
  mutations as riskCategoryMutations,
  queries as riskCategoryQueries,
  types as riskCategoryTypes
} from '../graphql/schemas/riskAssessments/categories';
import {
  mutations as riskConformityMutations,
  queries as riskConformityQueries,
  types as riskConformityTypes
} from '../graphql/schemas/riskAssessments/conformities';
import {
  mutations as riskAssessmentMutations,
  queries as riskAssessmentQueries,
  types as riskAssessmentTypes
} from '../graphql/schemas/riskAssessments/riskAssessments';
import {
  mutations as operationCategoryMutations,
  queries as operationCategoryQueries,
  types as operationCategoryTypes
} from './schemas/operations/categories';
import {
  mutations as operationMutations,
  queries as operationQueries,
  types as operationTypes
} from './schemas/operations/operations';

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${riskCategoryTypes}
    ${riskConformityTypes}
    ${riskFormSubmissionTypes}
    ${riskAssessmentTypes}
    ${operationCategoryTypes}
    ${operationTypes}
    
    extend type Query {
      ${riskCategoryQueries}
      ${riskConformityQueries}
      ${riskFormSubmissionQueries}
      ${riskAssessmentQueries}
      ${operationCategoryQueries}
      ${operationQueries}
    }
    
    extend type Mutation {
      ${riskCategoryMutations}
      ${riskConformityMutations}
      ${riskFormSubmissionMutations}
      ${riskAssessmentMutations}
      ${operationCategoryMutations}
      ${operationMutations}
    }
  `;
};

export default typeDefs;
