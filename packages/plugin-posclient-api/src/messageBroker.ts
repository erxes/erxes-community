import { generateModels } from './connectionResolver';
import { graphqlPubsub, serviceDiscovery } from './configs';
import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import {
  importProducts,
  importSlots,
  preImportProducts,
  receivePosConfig,
  receiveProduct,
  receiveProductCategory,
  receiveUser
} from './graphql/utils/syncUtils';
import { sendRPCMessage } from '@erxes/api-utils/src/messageBroker';

let client;

const webbuilderReplacer = async ({
  models,
  subdomain,
  action,
  sitename,
  query,
  html,
  pagename,
  params
}) => {
  let result = '';

  if (action === 'productCategories') {
    result = `
      <ul id="product-categories">
      </ul>
    `;
  }

  if (action === 'productCategoriesScript') {
    result = `
      <script>
        $(document).ready(() => {
          $.ajax({
            url: "http://localhost:4000/pl:posclient/product-categories",
            data: {},
            success: (data) => {
              var rows = '';

              for (const category of data) {
                rows += '<li><a href="${sitename}/plw/posclient/product-category-detail?categoryId='+category._id+'">' + category.name + '</a></li>';
              }

              $('#product-categories').append(rows);
            }
          })
        });
      </script>
    `;
  }

  if (action === 'products') {
    result = `
      <div id="products">
      </div>
    `;
  }

  if (action === 'productsScript') {
    const productItemTemplate = await sendCommonMessage({
      subdomain,
      serviceName: 'webbuilder',
      action: 'pages.findOne',
      isRPC: true,
      data: {
        name: 'posclient:product-item'
      }
    });

    result = `
      <script>
        $(document).ready(() => {
          var productItemTemplate = '${productItemTemplate.html}';

          $.ajax({
            url: "http://localhost:4000/pl:posclient/products?categoryId=${query.categoryId}",
            data: {},
            success: (data) => {
              var rows = '';

              for (const product of data) {
                var temp = productItemTemplate.replace('{{ product.name }}', product.name);
                temp = temp.replace('{{ product._id }}', product._id);
                rows+= temp;
              }

              $('#products').append(rows);
            }
          })
        });
      </script>
    `;
  }

  if (pagename) {
    result = html;

    if (pagename === 'product-detail') {
      const product = await models.Products.findOne({ _id: query.productId });

      if (product) {
        result = result.replace('{{ product.name }}', product.name);
        result = result.replace('{{ product.image }}', product.image);

        result += `
          <div id="quantity-chooser">
            <button id="quantity-chooser-minus">-<button>
              <span id="quantity-chooser-quantity"><span>
            <button id="quantity-chooser-plus">+</button>
          </div>

          <button id="checkout">Checkout<button>

          <script>
            let quantity = 1;

            const items = [];

            function showQuantity() {
              $("#quantity-chooser-quantity").text(quantity);
            }

            $(document).ready(() => {
              showQuantity();

              $("#quantity-chooser-minus").click(() => {
                if (quantity > 1) {
                  quantity--;
                  showQuantity();
                }
              });

              $("#quantity-chooser-plus").click(() => {
                quantity++;
                showQuantity();
              });

              $("#add-to-cart").click(() => {
                items.push({
                  productId: "${product._id}",
                  count: quantity,
                  unitPrice: ${product.unitPrice || 0}
                })
              });

              $("#checkout").click(() => {
                $.ajax({
                  url: "http://localhost:4000/graphql",
                  method: "post",
                  contentType: "application/json",
                  data: JSON.stringify({
                    query: 'mutation($items: [OrderItemInput], $totalAmount: Float!, $type: String!, $customerId: String!, $branchId: String) { ordersAdd(items: $items, totalAmount: $totalAmount, type: $type, customerId: $customerId, branchId: $branchId) { _id } }',
                    variables: {
                      items,
                      customerId: 'fdfsdfdsfds',
                      totalAmount: 100,
                      branchId: "czWMik5pHMCYMNDgK",
                      type: 'take'
                    }
                  }),
                  success: () => {
                    alert('Success');
                  }
                })
              });
            });
          </script>
        `;
      }
    }
  }

  return result;
};

export const initBroker = async cl => {
  const { SKIP_REDIS } = process.env;

  let channelToken = '';
  if (SKIP_REDIS) {
    const models = await generateModels('OS');

    if (!models) {
      throw new Error('not yet message broker, cause: cant connect models');
    }

    const config = await models.Configs.findOne().lean();
    if (!config || !config.token) {
      return;
    }

    channelToken = `_${config.token}`;
  }

  client = cl;
  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue(
    `posclient:crudData${channelToken}`,
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);
      const { token } = data;

      if (data) {
        switch (data.type) {
          case 'product':
            await receiveProduct(models, data);
            break;
          case 'productCategory':
            await receiveProductCategory(models, data);
            break;
          case 'user':
            await receiveUser(models, data);
            break;
          case 'pos':
            await receivePosConfig(subdomain, models, data);
            break;
          case 'productGroups':
            const { productGroups = [] } = data;
            await preImportProducts(models, token, productGroups);
            await importProducts(subdomain, models, token, productGroups);
            break;
          case 'slots':
            const { slots = [] } = data;
            await importSlots(models, slots, token);
            break;
          default:
            break;
        }
      }
    }
  );

  consumeQueue(
    `posclient:updateSynced${channelToken}`,
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);
      const { responseIds, orderId } = data;

      await models.Orders.updateOne(
        { _id: orderId },
        { $set: { synced: true } }
      );
      await models.PutResponses.updateMany(
        { _id: { $in: responseIds } },
        { $set: { synced: true } }
      );
    }
  );

  consumeQueue(
    `posclient:erxes-posclient-to-pos-api${channelToken}`,
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);
      const { order } = data;

      await models.Orders.updateOne(
        { _id: order._id },
        { $set: { ...order } },
        { upsert: true }
      );

      const bulkOps: any[] = [];

      for (const item of order.items) {
        bulkOps.push({
          updateOne: {
            filter: { _id: item._id },
            update: {
              $set: {
                ...item,
                orderId: order._id
              }
            },
            upsert: true
          }
        });
      }
      if (bulkOps.length) {
        await models.OrderItems.bulkWrite(bulkOps);
      }

      await graphqlPubsub.publish('ordersOrdered', {
        ordersOrdered: {
          ...(await models.Orders.findOne({ _id: order._id }).lean()),
          _id: order._id,
          status: order.status,
          customerId: order.customerId,
          customerType: order.customerType
        }
      });
    }
  );

  consumeRPCQueue(
    `posclient:health_check${channelToken}`,
    async ({ subdomain, data }) => {
      if (channelToken) {
        return {
          status: 'success',
          data: { healthy: 'ok' }
        };
      }

      const models = await generateModels(subdomain);
      const conf = await models.Configs.findOne({ token: data.token });

      if (!conf) {
        return {
          status: 'success',
          data: { healthy: 'no' }
        };
      }

      return {
        status: 'success',
        data: { healthy: 'ok' }
      };
    }
  );

  consumeRPCQueue(
    `posclient:covers.remove${channelToken}`,
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      const { cover } = data;
      await models.Covers.updateOne(
        { _id: cover._id },
        { $set: { status: 'reconf' } }
      );
      return {
        status: 'success',
        data: await models.Covers.findOne({ _id: cover._id })
      };
    }
  );

  consumeRPCQueue(
    'posclient:webbuilder.replacer',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await webbuilderReplacer({ models, subdomain, ...data })
      };
    }
  );
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string }
): Promise<any> => {
  return sendMessage({
    serviceDiscovery,
    client,
    ...args
  });
};

export const sendMessageWrapper = async (
  serviceName: string,
  args: ISendMessageArgs
): Promise<any> => {
  const { SKIP_REDIS } = process.env;
  if (SKIP_REDIS) {
    const { action, isRPC, defaultValue } = args;

    if (!client) {
      return defaultValue;
    }

    // check connected gateway on server and check some plugins isAvailable
    if (isRPC) {
      const longTask = async () =>
        await sendRPCMessage('gateway:isServiceAvailable', serviceName);

      const timeout = (cb, interval) => () =>
        new Promise(resolve => setTimeout(() => cb(resolve), interval));

      const onTimeout = timeout(resolve => resolve(false), 1000);

      let response = false;
      await Promise.race([longTask, onTimeout].map(f => f())).then(
        result => (response = result as boolean)
      );

      if (!response) {
        return defaultValue;
      }
    }

    return sendMessage({
      client,
      serviceDiscovery,
      serviceName: '',
      ...args,
      action: `${serviceName}:${action}`
    });
  }

  return sendMessage({
    client,
    serviceDiscovery,
    serviceName,
    ...args
  });
};

export const sendPosMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessageWrapper('pos', args);
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessageWrapper('core', args);
};

export const sendInventoriesMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('inventories', args);
};

export const sendContactsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('contacts', args);
};

export const sendLoyaltiesMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('loyalties', args);
};

export const sendPricingMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('pricing', args);
};

export const sendTagsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessageWrapper('tags', args);
};

export const sendSegmentsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('segments', args);
};

export const sendFormsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessageWrapper('forms', args);
};

export const fetchSegment = (
  subdomain: string,
  segmentId: string,
  options?,
  segmentData?: any
) =>
  sendSegmentsMessage({
    subdomain,
    action: 'fetchSegment',
    data: { segmentId, options, segmentData },
    isRPC: true
  });

export default function() {
  return client;
}
