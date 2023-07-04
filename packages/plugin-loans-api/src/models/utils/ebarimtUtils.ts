import { IModels } from '../../connectionResolver';
import { sendMessageBroker } from '../../messageBroker';
import { ITransactionDocument } from '../definitions/transactions';

interface IEBarimtConfig {}

export async function createEbarimt(
  models: IModels,
  subdomain: string,
  ebarimtConfig: any,
  transaction: ITransactionDocument
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
      barcode: '',
      uom: ebarimtConfig.amountEBarimtProduct.uom,
      vat: 10,
      citytax: 0,
      descount: 0,
      hasVat: true,
      productName: ebarimtConfig.amountEBarimtProduct.name,
      productCode: ebarimtConfig.amountEBarimtProduct.code
    });
  }

  if (
    ebarimtConfig.interestEBarimtProduct &&
    ebarimtConfig.isInterestUseEBarimt &&
    transaction?.interestEve &&
    transaction.interestNonce &&
    transaction.interestEve + transaction.interestNonce > 0
  ) {
    details.push({
      productId: ebarimtConfig.interestEBarimtProduct._id,
      amount: transaction.interestEve + transaction.interestNonce,
      count: 1,
      inventoryCode: ebarimtConfig.interestEBarimtProduct.code
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
      inventoryCode: ebarimtConfig.undueEBarimtProduct.code
    });
  }

  const orderInfo = {
    number: new Date().getTime(),
    date:
      new Date().toISOString().split('T')[0] +
      ' ' +
      new Date().toTimeString().split(' ')[0],
    orderId: transaction._id,
    hasVat: true,
    hasCitytax: false,
    billType: '1',
    description: 'string',
    details: details,
    nonCashAmount: details.reduce((v, m) => v + m.amount, 0)
  };

  console.log(orderInfo);

  const config = {
    districtName: ebarimtConfig?.districtName,
    companyRD: ebarimtConfig?.organizationRegister,
    vatPercent: 10,
    cityTaxPercent: 10,
    defaultGSCode: '3929000'
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

  await models.Transactions.updateOne(
    { _id: transaction._id },
    { $set: { ebarimt: ebarimt } }
  );
}
