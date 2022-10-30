import CategoryQueries from './categories';
import ConformityQueries from './conformities';
import RiskAssessmentQueries from './riskAssessments';

export default {
  ...CategoryQueries,
  ...ConformityQueries,
  ...RiskAssessmentQueries
};
