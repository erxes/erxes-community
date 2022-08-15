import { IContext } from '../../../connectionResolver';
import { sendCoreMessage } from '../../../messageBroker';
import { ITransactionDocument } from '../../../models/definitions/transactions';

export default {
  async department(
    transaction: ITransactionDocument,
    _,
    { subdomain }: IContext
  ) {
    return await sendCoreMessage({
      subdomain,
      action: 'departments.findOne',
      data: {
        _id: transaction.departmentId
      },
      isRPC: true
    });
  },

  async branch(transaction: ITransactionDocument, _, { subdomain }: IContext) {
    return sendCoreMessage({
      subdomain,
      action: 'branches.findOne',
      data: {
        _id: transaction.branchId
      },
      isRPC: true
    });
  }
};
