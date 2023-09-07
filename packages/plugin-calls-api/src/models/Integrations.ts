import { Model } from 'mongoose';
import {
  IIntegrationDocument,
  integrationSchema
} from './definitions/integrations';
import { IModels } from '../connectionResolver';

export interface IIntegrationModel extends Model<IIntegrationDocument> {}

export const loadIntegrationClass = (models: IModels) => {
  class Integration {}

  integrationSchema.loadClass(Integration);

  return integrationSchema;
};
