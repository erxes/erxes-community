import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { IConfigsDocument, configsSchema } from './definitions/items';
export interface IConfigModel extends Model<IConfigsDocument> {
  addConfig(doc): Promise<IConfigsDocument>;
  updateConfig(_id, doc): Promise<IConfigsDocument>;
  removeConfigs(ids: string[]): Promise<IConfigsDocument>;
}

const validDoc = doc => {
  if (!doc.boardId) {
    throw new Error(`Cannot provide assessment config without a boardId`);
  }
  if (!doc.pipelineId) {
    throw new Error(`Cannot provide assessment config without a pipelineId`);
  }

  if (
    !doc.groupId &&
    !doc.itemId &&
    !doc.customFieldId &&
    !doc.configs.some(config => config.itemId || config.groupId)
  ) {
    throw new Error(`Select some configration on assessment config`);
  }
};

export const loadConfigs = (models: IModels, subdomain: string) => {
  class ConfigsClass {
    public static async addConfig(doc) {
      try {
        validDoc(doc);
      } catch (e) {
        throw new Error(e.message);
      }

      return models.Configs.create({ ...doc });
    }

    public static async updateConfig(_id: string, doc) {
      try {
        validDoc(doc);
      } catch (e) {
        throw new Error(e.message);
      }
      if (!_id) {
        throw new Error('Cannot update assessment configuration without id');
      }

      return models.Configs.findByIdAndUpdate(_id, {
        ...doc,
        modifiedAt: new Date()
      });
    }
    public static async removeConfigs(ids: string[]) {
      return await models.Configs.deleteMany({
        _id: { $in: ids }
      });
    }
  }

  configsSchema.loadClass(ConfigsClass);
  return configsSchema;
};
