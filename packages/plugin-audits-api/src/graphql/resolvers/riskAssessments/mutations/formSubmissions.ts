import { IContext } from '../../../../connectionResolver';
import { IRiskFormSubmissionsParams } from '../../../../common/types/riskAssessment';

const formSubmissionMutations = {
  riskFormSaveSubmissions(_root, params: IRiskFormSubmissionsParams, { models }: IContext) {
    return models.RiksFormSubmissions.formSubmissionsSave(params);
  }
};

export default formSubmissionMutations;
