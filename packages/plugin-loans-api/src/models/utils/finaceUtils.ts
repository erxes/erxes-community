import { IModels } from '../../connectionResolver';
import { CONTRACT_CLASSIFICATION } from '../definitions/constants';
import { IContractTypeDocument } from '../definitions/contractTypes';
import { IContractDocument } from '../definitions/contracts';
import { ITransaction } from '../definitions/transactions';

async function generateFinance(tr: ITransaction, models: IModels) {
  const contract = await models.Contracts.findOne({ _id: tr.contractId }).lean<
    IContractDocument
  >();

  const contractType = await models.ContractTypes.findOne({
    _id: contract?.contractTypeId
  }).lean<IContractTypeDocument>();
  if (!contract) throw new Error('aldaa :p');

  let financeTransaction = fillTransaction(tr, contract);

  return financeTransaction;
}

function findAccounts(
  classification: string
): {
  paymentAccount: string;
  interestAccount: string;
  undueAccount: string;
  debtAccount: string;
} {
  const accounts = {
    paymentAccount: '1701',
    interestAccount: '2701',
    undueAccount: '3701',
    debtAccount: '4101'
  };

  switch (classification) {
    case CONTRACT_CLASSIFICATION.EXPIRED:
      accounts.paymentAccount = '1701';
      accounts.interestAccount = '2701';
      accounts.undueAccount = '3701';
      accounts.debtAccount = '4101';
      break;

    case CONTRACT_CLASSIFICATION.DOUBTFUL:
      accounts.paymentAccount = '1701';
      accounts.interestAccount = '2701';
      accounts.undueAccount = '3701';
      accounts.debtAccount = '4101';
      break;

    case CONTRACT_CLASSIFICATION.NEGATIVE:
      accounts.paymentAccount = '1701';
      accounts.interestAccount = '2701';
      accounts.undueAccount = '3701';
      accounts.debtAccount = '4101';
      break;

    case CONTRACT_CLASSIFICATION.BAD:
      accounts.paymentAccount = '1701';
      accounts.interestAccount = '2701';
      accounts.undueAccount = '3701';
      accounts.debtAccount = '4101';
      break;

    default:
      break;
  }

  return accounts;
}

function fillTransaction(tr: ITransaction, contract: IContractDocument) {
  var result: {
    trDate: Date;
    ktAmount: number;
    dtAmount: number;
    account: string;
    currency: string;
  }[] = [];
  const account = findAccounts(contract.classification);
  if (tr.payment && tr.payment > 0) {
    result.push({
      trDate: tr.payDate,
      ktAmount: tr.payment,
      dtAmount: 0,
      account: account.paymentAccount,
      currency: contract.createdBy
    });
  }
  const interest = (tr.interestEve || 0) + (tr.interestNonce || 0);
  if (interest > 0) {
    result.push({
      trDate: tr.payDate,
      ktAmount: interest,
      dtAmount: 0,
      account: account.interestAccount,
      currency: contract.createdBy
    });
  }

  if (tr.undue && tr.undue > 0) {
    result.push({
      trDate: tr.payDate,
      ktAmount: tr.undue,
      dtAmount: 0,
      account: account.undueAccount,
      currency: contract.createdBy
    });
  }

  if (tr.debt && tr.debt > 0) {
    result.push({
      trDate: tr.payDate,
      ktAmount: tr.debt,
      dtAmount: 0,
      account: account.debtAccount,
      currency: contract.createdBy
    });
  }

  const debitAccount = '1001';
  result.push({
    trDate: tr.payDate,
    ktAmount: 0,
    dtAmount: tr.total,
    account: debitAccount,
    currency: contract.createdBy
  });

  return result;
}
