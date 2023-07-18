import { IModels } from '../../connectionResolver';
import { sendMessageBroker } from '../../messageBroker';
import { IContract } from '../definitions/contracts';
import { ITransactionDocument } from '../definitions/transactions';

export async function createEbarimt(
  models: IModels,
  subdomain: string,
  ebarimtConfig: any,
  transaction: ITransactionDocument,
  contract: IContract,
  {
    isGetEBarimt,
    isOrganization,
    organizationRegister
  }: {
    isGetEBarimt?: boolean;
    isOrganization?: boolean;
    organizationRegister?: string;
  }
) {
  let details: any[] = [];

  if (
    ebarimtConfig.amountEBarimtProduct &&
    ebarimtConfig.isAmountUseEBarimt &&
    transaction?.payment &&
    transaction.payment > 0
  ) {
    details.push({
      productId: ebarimtConfig.amountEBarimtProduct._id,
      amount: transaction.payment,
      count: 1,
      discount: 0
    });
  }

  const interest =
    (transaction?.interestEve || 0) + (transaction?.interestNonce || 0);

  if (
    ebarimtConfig.interestEBarimtProduct &&
    ebarimtConfig.isInterestUseEBarimt &&
    interest &&
    interest > 0
  ) {
    details.push({
      productId: ebarimtConfig.interestEBarimtProduct._id,
      amount: interest,
      count: 1,
      discount: 0
    });
  }

  if (
    ebarimtConfig.undueEBarimtProduct &&
    ebarimtConfig.isUndueUseEBarimt &&
    transaction?.undue &&
    transaction.undue > 0
  ) {
    details.push({
      productId: ebarimtConfig.undueEBarimtProduct._id,
      amount: transaction.undue,
      count: 1,
      discount: 0
    });
  }

  const orderInfo: any = {
    number: transaction.number, // transactionii number l baihad bolno
    date:
      new Date().toISOString().split('T')[0] +
      ' ' +
      new Date().toTimeString().split(' ')[0],
    orderId: transaction._id,
    billType: '1', // ** baiguullaga bol '3'
    description: 'string',
    details: details,
    nonCashAmount: details.reduce((v, m) => v + m.amount, 0)
  };

  if (isGetEBarimt && isOrganization && organizationRegister) {
    orderInfo.billType = '3';
    orderInfo.customerCode = organizationRegister;
  } else if (contract.customerType === 'company') {
    const company = await sendMessageBroker(
      {
        subdomain,
        action: 'companies.findOne',
        data: { _id: contract.customerId },
        isRPC: true
      },
      'contacts'
    );
    orderInfo.billType = '3';
    orderInfo.customerCode = company.code;
  }

  if (orderInfo.billType === '3') {
    const companyCheck = await sendMessageBroker(
      {
        subdomain,
        action: 'putresponses.getCompany',
        data: { companyRD: orderInfo.customerCode },
        isRPC: true
      },
      'ebarimt'
    );

    if (companyCheck?.info?.found === false) return;
  }

  const config = {
    districtName: ebarimtConfig?.districtName,
    companyRD: ebarimtConfig?.organizationRegister,
    vatPercent: 10,
    cityTaxPercent: 1,
    hasVat: true,
    hasCitytax: false,
    defaultGSCode: ebarimtConfig?.defaultGSCode
  };

  const ebarimt = await sendMessageBroker(
    {
      action: 'putresponses.putDatas',
      data: {
        contentType: 'loans:transaction',
        contentId: transaction._id,
        orderInfo,
        config
      },
      subdomain,
      isRPC: true
    },
    'ebarimt'
  );
  if (ebarimt.length > 0)
    await models.Transactions.updateOne(
      { _id: transaction._id },
      {
        $set: {
          ebarimt: {
            success: ebarimt[0]?.success,
            _id: ebarimt[0]?._id,
            taxType: ebarimt[0]?.taxType,
            vat: ebarimt[0]?.vat
          }
        }
      }
    );
}
