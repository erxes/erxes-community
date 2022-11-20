import { IContext } from '../../../connectionResolver';
import { IRiskFormSubmissionParams } from '../../../models/definitions/common';

const formSubmissionQueries = {
  riskFormSubmitHistory(
    _root,
    { riskAssessmentId }: { riskAssessmentId: string },
    { models }: IContext
  ) {
    return models.RiksFormSubmissions.formSubmitHistory(riskAssessmentId);
  }
};

export default formSubmissionQueries;
