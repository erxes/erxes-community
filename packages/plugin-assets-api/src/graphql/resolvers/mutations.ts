import { IContext } from '../../connectionResolver';
import { requireLogin } from '@erxes/api-utils/src/permissions';
import { IAssets, IAssetsCategory } from '../../models/definitions/assets';

const templateMutations = {
  /**
   * Creates a new template
   */
  async assetsAdd(_root, doc: IAssets, { models }: IContext) {
    const template = await models.assets.createAssets(doc);

    return template;
  },

  /**
   * Creates assetsCategory
   */
  async assetsCategoryAdd(_root, doc: IAssetsCategory, { models }: IContext) {
    const template = await models.assetsCategory.createAssetsCategory(doc);

    return template;
  },

  /**
   * Edit assets
   */
  async assetsEdit(_root, { _id, ...doc }, { models }: IContext) {
    const update = await models.assets.editAssets(_id, doc);

    return update;
  },

  /**
   * Edit assetsCategory
   */
  async assetsCategoryEdit(_root, { _id, ...doc }, { models }: IContext) {
    const update = await models.assetsCategory.editAssetsCategory(_id, doc);

    return update;
  },

  /**
   * Remove assets
   */
  assetsDelete: async (
    _root,
    { assetIds }: { assetIds: string[] },
    { models }: IContext
  ) => {
    return models.assets.deleteAssets(assetIds);
  },

  /**
   * Remove assetsCategory
   */
  async assetsCategoryDelete(_root, { _id }, { models }: IContext) {
    const remove = await models.assetsCategory.deleteAssetsCategory(_id);

    return remove;
  }
};

// requireLogin(templateMutations, 'assetsAdd');

export default templateMutations;
