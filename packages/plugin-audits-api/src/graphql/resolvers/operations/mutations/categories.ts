import { IContext } from '../../../../connectionResolver';

const OperationMutations = {
  async auditOperationCategoryAdd(_root, { doc }, { models }: IContext) {
    return models.OperationCategories.categoryAdd(doc);
  },

  async auditOperationCategoryRemove(_root, { _id }, { models }: IContext) {
    return models.OperationCategories.categoryRemove(_id);
  }
};

export default OperationMutations;
