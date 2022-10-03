import { IAsset, IAssetDocument } from '../../../common/types/asset';
import { IContext } from '../../../connectionResolver';
import { MODULE_NAMES, putCreateLog, putDeleteLog, putUpdateLog } from '../../../logUtils';

interface IAssetsEdit extends IAsset {
  _id: string;
}

const assetMutations = {
  async assetsAdd(_root, doc: IAsset, { user, docModifier, models, subdomain }: IContext) {
    const asset = await models.Asset.createAsset(docModifier(doc));

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET,
        newData: {
          ...doc,
          groupId: asset.groupId,
          customFieldsData: asset.customFieldsData
        },
        object: asset
      },
      user
    );

    return asset;
  },

  /**
   * Edits a asset
   * @param {string} param2._id Asset id
   * @param {Object} param2.doc Asset info
   */
  async assetsEdit(_root, { _id, ...doc }: IAssetsEdit, { user, models, subdomain }: IContext) {
    const asset = await models.Asset.getAssets({ _id });
    const updated = await models.Asset.updateAsset(_id, doc);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET,
        object: asset,
        newData: { ...doc, customFieldsData: updated.customFieldsData },
        updatedDocument: updated
      },
      user
    );

    return updated;
  },
  async assetsRemove(_root, { assetIds }: { assetIds: string[] }, { user, models, subdomain }: IContext) {
    const assets: IAssetDocument[] = await models.Asset.find({
      _id: { $in: assetIds }
    }).lean();

    const response = await models.Asset.removeAssets(assetIds);

    for (const asset of assets) {
      await putDeleteLog(models, subdomain, { type: MODULE_NAMES.ASSET, object: asset }, user);
    }

    return response;
  },
  async assetsMerge(_root, { assetIds, assetFields }: { assetIds: string[]; assetFields: IAsset }, { models }: IContext) {
    return models.Asset.mergeAssets(assetIds, { ...assetFields });
  }
};

export default assetMutations;
