import customScalars from '@erxes/api-utils/src/customScalars';

import Mutation from './mutations';
import Query from './queries';

import RiskAssessment from '../../dataLoaders/resolvers/riskAssessment';
import RiskConfirmity from '../../dataLoaders/resolvers/riskConfirmity';
import RiskFormSubmission from '../../dataLoaders/resolvers/riskFormSubmission';
import FormSubmissionUserType from '../../dataLoaders/resolvers/riskFormSubmissionUsers';
import FormSubmissionFieldType from '../../dataLoaders/resolvers/riskFormSubmissionField';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,

  RiskConfirmity,
  RiskAssessment,
  RiskFormSubmission,
  FormSubmissionUserType,
  FormSubmissionFieldType,

  Mutation,
  Query
});

export default resolvers;
