import { IContext } from '../../../../connectionResolver';

const OperationQueries = {
  async auditOperations(_root, params, { models }: IContext) {
    return await models.Operations.find(params);
  },
  async auditOperationsTotalCount(_root, params, { models }: IContext) {
    return await models.Operations.find(params).countDocuments();
  }
};

export default OperationQueries;
