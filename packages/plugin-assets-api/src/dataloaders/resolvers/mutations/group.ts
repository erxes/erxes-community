import { IContext } from '../../../connectionResolver';
import { putCreateLog, MODULE_NAMES, putUpdateLog, putDeleteLog } from '../../../logUtils';
import { IAssetGroup } from '../../../common/types/asset';

interface IAssetGroupEdit extends IAssetGroup {
  _id: string;
}

const assetGroupMutations = {
  async assetGroupAdd(_root, doc: IAssetGroup, { user, docModifier, models, subdomain }: IContext) {
    const assetGroup = await models.AssetGroup.assetGroupAdd(docModifier(doc));

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET_GROUP,
        newData: { ...doc, order: assetGroup.order },
        object: assetGroup
      },
      user
    );

    return assetGroup;
  },

  async assetGroupEdit(_root, { _id, ...doc }: IAssetGroupEdit, { user, models, subdomain }: IContext) {
    const assetGroup = await models.AssetGroup.getAssetGroup({
      _id
    });
    const updated = await models.AssetGroup.updateAssetGroup(_id, doc);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.ASSET_GROUP,
        object: assetGroup,
        newData: doc,
        updatedDocument: updated
      },
      user
    );

    return updated;
  },

  async assetGroupRemove(_root, { _id }: { _id: string }, { user, models, subdomain }: IContext) {
    const assetGroup = await models.AssetGroup.getAssetGroup({
      _id
    });
    const removed = await models.AssetGroup.assetGroupRemove(_id);

    await putDeleteLog(models, subdomain, { type: MODULE_NAMES.ASSET_GROUP, object: assetGroup }, user);

    return removed;
  }
};

export default assetGroupMutations;
