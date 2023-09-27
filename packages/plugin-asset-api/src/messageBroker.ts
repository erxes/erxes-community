import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { generateModels } from './connectionResolver';
import { serviceDiscovery } from './configs';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue, consumeQueue } = client;

  consumeRPCQueue('assets:findOneUom', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    return {
      data: await models.Uoms.findOne(data).lean(),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:findUom', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    return {
      data: await models.Uoms.find(data).lean(),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.findOne(data).lean(),
      status: 'success'
    };
  });

  consumeRPCQueue(
    'assets:categories.find',
    async ({ subdomain, data: { query, sort, regData } }) => {
      const models = await generateModels(subdomain);

      return {
        data: regData
          ? await models.AssetCategories.find({
              ...query,
              order: { $regex: new RegExp(regData) }
            }).sort(sort)
          : await models.AssetCategories.find(query)
              .sort(sort)
              .lean(),
        status: 'success'
      };
    }
  );

  consumeRPCQueue('assets:categories.withChilds', async ({ subdomain, data: { _id } }) => {
    const models = await generateModels(subdomain);
    const category = await models.AssetCategories.findOne({ _id }).lean();

    return {
      data: await models.AssetCategories.find({
        order: { $regex: new RegExp(category.order) },
        status: { $nin: ['disabled', 'archived'] }
      })
        .sort({ order: 1 })
        .lean(),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:categories.findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    return {
      data: await models.AssetCategories.findOne(data).lean(),
      status: 'success'
    };
  });

  consumeRPCQueue(
    'assets:categories.updateAssetCategory',
    async ({ subdomain, data: { _id, doc } }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.AssetCategories.updateAssetCategory(_id, doc),
        status: 'success'
      };
    }
  );

  consumeRPCQueue('assets:categories.createAssetCategory', async ({ subdomain, data: { doc } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.AssetCategories.createAssetCategory(doc),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:categories.removeAssetCategory', async ({ subdomain, data: { _id } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.AssetCategories.removeAssetCategory(_id),
      status: 'success'
    };
  });

  consumeRPCQueue(
    'assets:find',
    async ({ subdomain, data: { query, sort, skip, limit, categoryId } }) => {
      const models = await generateModels(subdomain);

      if (categoryId) {
        const category = await models.AssetCategories.findOne({
          _id: categoryId
        }).lean();
        const categories = await models.AssetCategories.find({
          order: { $regex: new RegExp(category.order) }
        }).lean();

        query.categoryId = { $in: categories.map(c => c._id) };
      }

      return {
        data: await models.Assets.find(query)
          .sort(sort)
          .skip(skip || 0)
          .limit(limit || 100)
          .lean(),
        status: 'success'
      };
    }
  );

  consumeRPCQueue('assets:count', async ({ subdomain, data: { query } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.find(query).countDocuments(),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:createAsset', async ({ subdomain, data: { doc } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.createAsset(doc),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:updateAsset', async ({ subdomain, data: { _id, doc } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.updateAsset(_id, doc),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:removeAssets', async ({ subdomain, data: { _ids } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.removeAssets(_ids),
      status: 'success'
    };
  });

  consumeQueue('assets:update', async ({ subdomain, data: { selector, modifier } }) => {
    const models = await generateModels(subdomain);

    return {
      data: await models.Assets.updateMany(selector, modifier),
      status: 'success'
    };
  });

  consumeRPCQueue('assets:tag', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    let response = {};

    if (data.action === 'count') {
      response = await models.Assets.countDocuments({
        tagIds: { $in: data._ids }
      });
    }

    if (data.action === 'tagObject') {
      await models.Assets.updateMany(
        { _id: { $in: data.targetIds } },
        { $set: { tagIds: data.tagIds } },
        { multi: true }
      );

      response = await models.Assets.find({
        _id: { $in: data.targetIds }
      }).lean();
    }

    return {
      status: 'success',
      data: response
    };
  });

  consumeRPCQueue('assets:generateInternalNoteNotif', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    const { contentTypeId, notifDoc } = data;

    const asset = await models.Assets.getAsset({ _id: contentTypeId });

    notifDoc.content = asset.name;

    return {
      status: 'success',
      data: notifDoc
    };
  });
};

export const sendRPCMessage = async (channel, message): Promise<any> => {
  return client.sendRPCMessage(channel, message);
};

export const sendFormsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'forms',
    ...args
  });
};

export const sendCardsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'cards',
    ...args
  });
};

export const sendProcessesMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'processes',
    ...args
  });
};

export const sendContactsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendTagsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'tags',
    ...args
  });
};

export default function() {
  return client;
}
