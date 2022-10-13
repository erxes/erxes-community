import { IModels } from '../connectionResolver';
import * as DataLoader from 'dataloader';
import * as _ from 'underscore';

export default function generateDataLoaderAsset(models: IModels) {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await models.Asset.find({
      _id: { $in: ids }
    }).lean();
    const resultById = _.indexBy(result, '_id');
    return ids.map(id => resultById[id]);
  });
}
