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

const webbuilderReplacer = async args => {
  const { models, subdomain, action = '', html, pagename } = args;

  const query = args.query || {};

  let result = '';

  if (action === 'productCategories') {
    result = `
      <ul id="plugin-posclient-product-categories">
      </ul>
    `;
  }

  if (action === 'products') {
    result = `
      <ul id="plugin-posclient-products" data-category-id="${query.categoryId}">
      </ul>
    `;
  }

  const productItemTemplate = await sendCommonMessage({
    subdomain,
    serviceName: 'webbuilder',
    action: 'pages.findOne',
    isRPC: true,
    data: {
      name: 'posclient:product-item'
    }
  });

  if (pagename) {
    result = html;

    if (pagename === 'product-detail') {
      const product = await models.Products.findOne({ _id: query.productId });

      if (product) {
        result = result.replace('{{ product.name }}', product.name);
        result = result.replace(
          '{{ product.image }}',
          product.attachment ? product.attachment.url : ''
        );
      }
    }
  }

  if (action.includes('filtered_products')) {
    const pieces = action.replace('filtered_products__', '').split('__');

    if (pieces.length === 2) {
      const [categoryCode, limit] = pieces;

      const category = await models.ProductCategories.findOne(
        { code: categoryCode },
        { _id: 1 }
      );

      result = `<div class="plugin-posclient-filtered-products" data-category-id="${category._id}" data-limit="${limit}"></div>`;
    }
  }

  if (action === 'script') {
    result = `
    <script>
      $(document).ready(() => {
        const fetchGraph = ({ query, variables, callback }) => {
          $.ajax({
            url: "http://localhost:4000/graphql",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
              query,
              variables
            }),
            success: ({ data }) => {
              callback(data);
            }
          })
        }

        const getLocalStorageItem = (key) => {
          const erxesStorage = JSON.parse(localStorage.getItem("erxes") || "{}");
          return erxesStorage[key];
        }

        const setLocalStorageItem = (key, value) => {
          const erxesStorage = JSON.parse(localStorage.getItem("erxes") || "{}");
          erxesStorage[key] = value;
          localStorage.setItem("erxes", JSON.stringify(erxesStorage));
        }

        const getCustomerId = () => getLocalStorageItem('customerId') || Math.random();
        const getOrderId = () => getLocalStorageItem('posclientOrderId');
        const setOrderId = (id) => setLocalStorageItem('posclientOrderId', id);

        let items = [];

        if (getOrderId()) {
          fetchGraph({
            query: 'query($_id: String!, $customerId: String,) { orderDetail(_id: $_id, customerId: $customerId) { _id, items { productId, count, unitPrice } } }',
            variables: {
              _id: getOrderId(),
              customerId: getCustomerId(),
            },
            callback: ({ orderDetail }) => {
              if (orderDetail) {
                items = orderDetail.items;

                refreshCounter();
              }
            }
          });
        }

        refreshCounter = () => {
          $('#cart-counter').text(items.length);
        }

        if ($("#add-to-cart").length > 0) {
          let quantity = 1;

          function showQuantity() {
            $("#quantity-chooser-quantity").text(quantity);
          }

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
              productId: "${query.productId}",
              count: quantity,
              unitPrice: 100
            });

            console.log('mmmmmmmmmmmm', items)

            const orderId = getOrderId();

            const variables = {
              items,
              customerId: getCustomerId(),
              totalAmount: 100,
              branchId: "czWMik5pHMCYMNDgK",
              type: 'delivery'
            }

            if (orderId) {
              fetchGraph({
                query: 'mutation($_id: String!, $items: [OrderItemInput], $totalAmount: Float!, $type: String!, $customerId: String!, $branchId: String) { ordersEdit(_id: $_id, items: $items, totalAmount: $totalAmount, type: $type, customerId: $customerId, branchId: $branchId) { _id } }',
                variables: {
                  _id: orderId,
                  ...variables,
                },
                callback: () => {
                  refreshCounter();
                  alert('Success');
                }
              });
            } else {
              fetchGraph({
                query: 'mutation($items: [OrderItemInput], $totalAmount: Float!, $type: String!, $customerId: String!, $branchId: String) { ordersAdd(items: $items, totalAmount: $totalAmount, type: $type, customerId: $customerId, branchId: $branchId) { _id } }',
                variables,
                callback: ({ ordersAdd }) => {
                  refreshCounter();

                  setOrderId(ordersAdd._id);

                  alert('Success');
                }
              });
            }
          });
        }

        const loadProducts = (categoryId, container) => {
          var productItemTemplate = \`${productItemTemplate.html}\`;

          fetchGraph({
            query: 'query($categoryId: String) { poscProducts(categoryId: $categoryId) { _id, name, attachment { url }, unitPrice } }',
            variables: {
              categoryId,
            },
            callback: ({ poscProducts }) => {
              var rows = '';

              for (const product of poscProducts) {
                var temp = productItemTemplate.replace('{{ product.name }}', product.name);
                temp = temp.replace('{{ product._id }}', product._id);
                temp = temp.replace('{{ product.image }}', product.attachment ? product.attachment.url : '');
                temp = temp.replace('{{ product.unitPrice }}', product.unitPrice);

                rows+= temp;
              }

              $(container).append(rows);
            }
          })
        }

        $('.plugin-posclient-filtered-products').each(function() {
          const categoryId = $(this).data('category-id');

          loadProducts(categoryId, this);
        });

        fetchOrders = () => {
          fetchGraph({
            query: 'query($customerId: String) { orders(customerId: $customerId) { _id, items { _id, count, unitPrice, productName, productImgUrl } } }',
            variables: {
              customerId: getCustomerId()
            },
            callback: ({ orders }) => {
              const firstRow = $('#checkout-order-list tbody tr:first').html();

              for (const order of orders) {
                for (const item of order.items) {
                  let newRow = firstRow;

                  newRow = newRow.replace('{{ order.productName }}', item.productName);
                  newRow = newRow.replace('{{ order.count }}', item.count);
                  newRow = newRow.replace('{{ order.unitPrice }}', item.unitPrice);
                  newRow = newRow.replace('{{ order.productImgUrl }}', item.productImgUrl);

                  $('#checkout-order-list tbody').append('<tr>' + newRow + '</tr');
                }
              }
            }
          });
        }

        if ($('#checkout-order-list').length > 0) {
          $('#checkout-order-list tbody tr:first').hide();

          fetchOrders();

          fetchGraph({
            query: 'mutation ( $amount: Float!  $contentType: String $contentTypeId: String $description: String $customerId: String $customerType: String $warningText: String) { generateInvoiceUrl( amount: $amount contentType: $contentType contentTypeId: $contentTypeId description: $description customerId: $customerId customerType: $customerType warningText: $warningText) }',
            variables: {
              amount: 1000,
              contentType: "pos:order",
              contentTypeId: "orderId",
              description: "Description",
              customerId: "customerId",
              customerType: "customer",
              warningText: "Warning"
            },
            callback: ({ generateInvoiceUrl }) => {
              $('#payment').attr('src', generateInvoiceUrl);
            }
          })

          window.addEventListener("message", (event) => {
            const { fromPayment, message, invoiceId } = event.data;
            if (fromPayment) {
              if (message === "paymentSuccessfull") {
                $('#payment').attr('src', '');
                alert(invoiceId);
              }
            }
          });

          $('#checkout-proceed').click(function () {
            alert('Proceed');
          });
        }

        if ($('#plugin-posclient-product-categories').length > 0) {
          fetchGraph({
            query: 'query { poscProductCategories { _id, name } }',
            variables: {},
            callback: ({ poscProductCategories }) => {
              for (const category of poscProductCategories) {
                $('#plugin-posclient-product-categories').append('<li><a href="/pl:webbuilder/ecommerce/plw/posclient/product-category-detail?categoryId=' + category._id + '">' + category.name + '</a></li>');
              }
            }
          })
        }

        if ($('#plugin-posclient-products').length > 0) {
          const categoryId = $('#plugin-posclient-products').data('category-id');
          loadProducts(categoryId, '#plugin-posclient-products');
        }
      });
    </script>
  `;
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
