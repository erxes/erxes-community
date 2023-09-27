import { Model, model } from 'mongoose';
// import { COMPANY_INDUSTRY_TYPES, SEX_OPTIONS, SOCIAL_LINKS } from '@erxes/api-utils/src/constants';
import { assetsConfigSchema, IAssetsConfig, IAssetsConfigDocument } from './definitions/configs';

export interface IAssetsConfigModel extends Model<IAssetsConfigDocument> {
  getConfig(code: string, defaultValue?: string): Promise<any>;
  createOrUpdateConfig({ code, value }: IAssetsConfig): IAssetsConfigDocument;
  constants();
}

export const loadAssetsConfigClass = models => {
  class AssetsConfig {
    /*
     * Get a Config
     */
    public static async getConfig(code: string, defaultValue?: any) {
      const config = await models.AssetsConfigs.findOne({ code });

      if (!config) {
        return defaultValue || '';
      }

      return config.value;
    }

    /**
     * Create or update config
     */
    public static async createOrUpdateConfig({ code, value }: { code: string; value: string[] }) {
      const obj = await models.AssetsConfigs.findOne({ code });

      if (obj) {
        await models.AssetsConfigs.updateOne({ _id: obj._id }, { $set: { value } });

        return models.AssetsConfigs.findOne({ _id: obj._id });
      }

      return models.AssetsConfigs.create({ code, value });
    }

    public static constants() {
      return {};
    }
  }

  assetsConfigSchema.loadClass(AssetsConfig);

  return assetsConfigSchema;
};
