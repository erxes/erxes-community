import { IRiskConfirmityDocument } from '../../models/definitions/confimity';
import { IContext } from '../../connectionResolver';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.RiksFormSubmissions.findOne({ _id });
  },

  async field(
    formSubmissionField: { fieldId: string; value: string },
    {},
    { dataLoaders }: IContext
  ) {
    return (
      (formSubmissionField.fieldId && dataLoaders.formField.load(formSubmissionField.fieldId)) ||
      null
    );
  }
};
