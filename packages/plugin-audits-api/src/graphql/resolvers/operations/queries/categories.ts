import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../../connectionResolver';

const OperationsQueries = {
  async auditOperationsCategories(_root, params, { models }: IContext) {
    return paginate(models.OperationCategories.find(params), params);
  },
  async auditOperationsCategoriesTotalCount(_root, params, { models }: IContext) {
    return models.OperationCategories.find(params).countDocuments();
  },
  async auditOperationsCategory(_root, { _id }, { models }: IContext) {
    return await models.OperationCategories.findOne({ _id });
  }
};

export default OperationsQueries;
