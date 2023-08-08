import { generateModels, IModels } from './connectionResolver';
import {
  sendFormsMessage,
  sendCoreMessage,
  sendProductsMessage,
  fetchSegment
} from './messageBroker';
import * as moment from 'moment';
import { IUserDocument } from '@erxes/api-utils/src/types';

const prepareData = async (
  models: IModels,
  subdomain: string,
  query: any
): Promise<any[]> => {
  const { segmentData, page, perPage } = query;

  let data: any[] = [];

  const skip = (page - 1) * perPage;

  const boardItemsFilter: any = {};
  let itemIds = [];

  if (segmentData.conditions) {
    itemIds = await fetchSegment(subdomain, '', { page, perPage }, segmentData);

    boardItemsFilter._id = { $in: itemIds };
  }

  if (!segmentData) {
    data = await models.PosOrders.find(boardItemsFilter)
      .skip(skip)
      .limit(perPage)
      .lean();
  }

  data = await models.PosOrders.find(boardItemsFilter).lean();

  return data;
};

const prepareDataCount = async (
  models: IModels,
  subdomain: string,
  query: any
): Promise<any> => {
  const { segmentData } = query;

  let data = 0;
  const boardItemsFilter: any = {};

  if (segmentData.conditions) {
    const itemIds = await fetchSegment(
      subdomain,
      '',
      { scroll: true, page: 1, perPage: 10000 },
      segmentData
    );

    boardItemsFilter._id = { $in: itemIds };
  }

  data = await models.PosOrders.find(boardItemsFilter).count();

  return data;
};

export const fillValue = async (
  models: IModels,
  subdomain: string,
  column: string,
  order: any
): Promise<string> => {
  let value = order[column];

  switch (column) {
    case 'createdAt':
      value = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'branchId':
      value = order.branchId ? order.branchId : 'branchId not found';
      break;
    case 'departmentId':
      const departmentId = order.departmentId;
      sendCoreMessage({
        subdomain,
        action: 'departments.findOne',
        data: { _id: departmentId },
        isRPC: true
      });
      value = departmentId ? departmentId : 'departmentId not found';
      break;
    case 'customerId':
      value = order.customerId ? order.customerId : 'customerId not found';
      break;
    case 'registerNumber':
      value = order.registerNumber
        ? order.registerNumber
        : 'registerNumber not found';
      break;
    case 'totalAmount':
      value = order.totalAmount ? order.totalAmount : 'totalAmount not found';
      break;
    case 'number':
      value = order.number ? order.number : 'number not found';
      break;
    case 'userId':
      const createdUser: IUserDocument | null = await sendCoreMessage({
        subdomain,
        action: 'users.findOne',
        data: {
          _id: order.userId
        },
        isRPC: true
      });

      value = createdUser ? createdUser.username : 'user not found';

      break;
    case 'convertDealId':
      value = order.convertDealId
        ? order.convertDealId
        : 'convertDealId not found';
      break;
    case 'billId':
      value = order.billId ? order.billId : 'billId not found';
      break;
    default:
      break;
  }

  return value || '';
};

const filposOrderitemValue = async (subdomain, column, item) => {
  const items = item.items;

  const itemsDocs: any[] = [];

  for (const itemData of items) {
    let product;
    let value;
    const result = {};
    switch (column) {
      case 'items.createdAt':
        value = moment(itemData.createdAt).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'items.discountPercent':
        value = itemData.discountPercent;
        break;
      case 'count':
        value = itemData.count;
        break;
      case 'items.productId':
        product =
          (await sendProductsMessage({
            subdomain,
            action: 'findOne',
            data: {
              _id: itemData.productId
            },
            isRPC: true
          })) || {};
        value = `${product.code} - ${product.name}`;
      case 'items.unitPrice':
        value = itemData.unitPrice;
        break;
      case 'items.orderId':
        value = itemData.orderId;
        break;
      case 'items.bonusCount':
        value = itemData.bonusCount;
        break;
      case 'items.bonusVoucherId':
        value = itemData.bonusVoucherId;
        break;
      case 'items.discountAmount':
        value = itemData.discountAmount;
        break;
    }

    result[column] = value;

    itemsDocs.push(result);
  }

  return itemsDocs;
};
export const IMPORT_EXPORT_TYPES = [
  {
    text: 'Pos Orders',
    contentType: 'pos',
    icon: 'server-alt'
  }
];

export default {
  importExportTypes: IMPORT_EXPORT_TYPES,

  prepareExportData: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { columnsConfig } = data;

    let totalCount = 0;
    const headers = [] as any;
    const excelHeader = [] as any;

    try {
      const results = await prepareDataCount(models, subdomain, data);

      totalCount = results;

      for (const column of columnsConfig) {
        if (column.startsWith('items')) {
          headers.push(column);
        } else {
          headers.push(column);
        }
      }

      for (const header of headers) {
        excelHeader.push(header);
      }
    } catch (e) {
      return {
        error: e.message
      };
    }
    return { totalCount, excelHeader };
  },

  getExportDocs: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { columnsConfig } = data;

    const docs = [] as any;
    const headers = [] as any;

    try {
      const results = await prepareData(models, subdomain, data);

      for (const column of columnsConfig) {
        if (column.startsWith('items')) {
          headers.push(column);
        } else {
          headers.push(column);
        }
      }

      for (const order of results) {
        const result = {};
        const OrderItemsDocs = [] as any;
        const posOrderItemsArray = [] as any;

        for (const column of headers) {
          let posOrderItem = {};
          if (column.startsWith('items')) {
            posOrderItem = {
              ...posOrderItem,
              ...(await filposOrderitemValue(subdomain, column, order))
            };
          } else {
            posOrderItem = {
              ...posOrderItem,
              [column]: await fillValue(models, subdomain, column, order)
            };
          }
          OrderItemsDocs.push(posOrderItem);
        }

        if (OrderItemsDocs.length > 0) {
          for (let i = 0; i < OrderItemsDocs.length; i++) {
            const sortedItem = [] as any;

            for (const posOrderDoc of OrderItemsDocs) {
              sortedItem.push(posOrderDoc[i]);
            }

            posOrderItemsArray.push(sortedItem);
          }
        }

        if (OrderItemsDocs.length > 0) {
          let index = 0;

          for (const posOrderElement of posOrderItemsArray) {
            const mergedObject = Object.assign({}, ...posOrderElement);
            if (index === 0) {
              docs.push({
                ...result,
                ...mergedObject
              });
              index++;
            } else {
              docs.push(mergedObject);
            }
          }
        } else {
          docs.push(result);
        }
      }
    } catch (e) {
      return { error: e.message };
    }

    return { docs };
  }
};
