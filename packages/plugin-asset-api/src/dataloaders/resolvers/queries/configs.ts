import * as dotenv from 'dotenv';
import { IContext } from '../../../connectionResolver';
dotenv.config();

const configQueries = {
  /**
   * AssetConfig object
   */
  assetsConfigs(_root, _args, { models }: IContext) {
    return models.AssetsConfigs.find({});
  }
};

// moduleRequireLogin(configQueries);

export default configQueries;
