import { IContext } from '../../../../connectionResolver';

const OperationMutations = {
  async auditOperationCategoryAdd(_root, { doc }, { models }: IContext) {
    return models.OperationCategories.categoryAdd(doc);
  }
};

export default OperationMutations;
