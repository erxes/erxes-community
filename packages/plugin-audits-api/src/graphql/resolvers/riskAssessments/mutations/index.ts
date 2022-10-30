import formSubmissionMutations from './formSubmissions';
import RiskAssessmentMutations from './riskAssessments';
import RiskAssessmentCategoryMutations from './categories';
import RiskConformityMutations from './conformities';

export default {
  ...RiskAssessmentMutations,
  ...RiskConformityMutations,
  ...RiskAssessmentCategoryMutations,
  ...formSubmissionMutations
};
