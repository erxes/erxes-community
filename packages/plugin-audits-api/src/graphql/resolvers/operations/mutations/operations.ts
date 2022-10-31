import { IContext } from '../../../../connectionResolver';

const OperationMutations = {
  async auditOperationAdd(_root, { doc }, { models }: IContext) {
    return models.Operations.operationAdd(doc);
  }
};

export default OperationMutations;
