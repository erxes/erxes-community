import { moduleCheckPermission, requireLogin } from '@erxes/api-utils/src/permissions';

import { IAsset, IAssetCategory, IAssetDocument } from '../../../models/definitions/assets';
import { putCreateLog, putDeleteLog, putUpdateLog, MODULE_NAMES } from '../../../logUtils';
import { IContext } from '../../../connectionResolver';

interface IAssetsEdit extends IAsset {
  _id: string;
}

interface IAssetCategoriesEdit extends IAssetCategory {
  _id: string;
}

const assetMutations = {
  /**
   * Creates a new asset
   * @param {Object} doc Asset document
   */
  async assetsAdd(_root, doc: IAsset, { user, docModifier, models, subdomain }: IContext) {
    const asset = await models.Assets.createAsset(docModifier(doc));

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET,
        newData: {
          ...doc,
          categoryId: asset.categoryId,
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
    const asset = await models.Assets.getAsset({ _id });
    const updated = await models.Assets.updateAsset(_id, doc);

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

  /**
   * Removes a asset
   * @param {string} param1._id Asset id
   */
  async assetsRemove(
    _root,
    { assetIds }: { assetIds: string[] },
    { user, models, subdomain }: IContext
  ) {
    const assets: IAssetDocument[] = await models.Assets.find({
      _id: { $in: assetIds }
    }).lean();

    const response = await models.Assets.removeAssets(assetIds);

    for (const asset of assets) {
      await putDeleteLog(models, subdomain, { type: MODULE_NAMES.ASSET, object: asset }, user);
    }

    return response;
  },

  /**
   * Creates a new asset category
   * @param {Object} doc Asset category document
   */
  async assetCategoriesAdd(
    _root,
    doc: IAssetCategory,
    { user, docModifier, models, subdomain }: IContext
  ) {
    const assetCategory = await models.AssetCategories.createAssetCategory(docModifier(doc));

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET_CATEGORY,
        newData: { ...doc, order: assetCategory.order },
        object: assetCategory
      },
      user
    );

    return assetCategory;
  },

  /**
   * Edits a asset category
   * @param {string} param2._id AssetCategory id
   * @param {Object} param2.doc AssetCategory info
   */
  async assetCategoriesEdit(
    _root,
    { _id, ...doc }: IAssetCategoriesEdit,
    { user, models, subdomain }: IContext
  ) {
    const assetCategory = await models.AssetCategories.getAssetCatogery({
      _id
    });
    const updated = await models.AssetCategories.updateAssetCategory(_id, doc);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET_CATEGORY,
        object: assetCategory,
        newData: doc,
        updatedDocument: updated
      },
      user
    );

    return updated;
  },

  /**
   * Removes a asset category
   * @param {string} param1._id AssetCategory id
   */
  async assetCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const assetCategory = await models.AssetCategories.getAssetCatogery({
      _id
    });
    const removed = await models.AssetCategories.removeAssetCategory(_id);

    await putDeleteLog(
      models,
      subdomain,
      { type: MODULE_NAMES.ASSET_CATEGORY, object: assetCategory },
      user
    );

    return removed;
  },

  /**
   * Merge assets
   */
  async assetsMerge(
    _root,
    { assetIds, assetFields }: { assetIds: string[]; assetFields: IAsset },
    { models }: IContext
  ) {
    return models.Assets.mergeAssets(assetIds, { ...assetFields });
  }
};

requireLogin(assetMutations, 'assetsRemove');
moduleCheckPermission(assetMutations, 'manageAssets');

export default assetMutations;
