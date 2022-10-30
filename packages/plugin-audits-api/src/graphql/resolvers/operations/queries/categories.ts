import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../../connectionResolver';

const OperationsQueries = {
  async auditOperationCategories(_root, params, { models }: IContext) {
    return paginate(models.OperationCategories.find(params), params);
  },
  async auditOperationCategoriesTotalCount(_root, params, { models }: IContext) {
    return models.OperationCategories.find(params).countDocuments();
  }
};

export default OperationsQueries;
