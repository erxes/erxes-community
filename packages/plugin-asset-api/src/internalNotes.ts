import { generateModels } from './connectionResolver';

export default {
  generateInternalNoteNotif: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { contentTypeId, notifDoc } = data;

    const asset = await models.Assets.getAsset({ _id: contentTypeId });

    notifDoc.content = asset.name;

    return notifDoc;
  }
};
