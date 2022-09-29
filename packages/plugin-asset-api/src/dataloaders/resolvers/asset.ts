import { IContext } from '../../connectionResolver';
import { IAssetDocument } from '../../common/types/asset';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Asset.findOne({ _id });
  },

  group(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.groupId && dataLoaders.assetGroup.load(asset.groupId)) || null;
  },

  vendor(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.vendorId && dataLoaders.company.load(asset.vendorId)) || null;
  }
};
