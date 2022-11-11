import { Document, Model, model, Schema } from 'mongoose';
import { field } from './utils';

export interface IIntegration {
  kind: string;
  name: string;
  brandId: string;
  channelIds: [string];
  accountId: string;
  erxesApiId: string;
  email: string;
  phoneNumber: string;
  recordUrl: string;
  expiration?: string;
  healthStatus?: string;
  error?: string;
}

export interface IIntegrationDocument extends IIntegration, Document {}

// schema for integration document
export const integrationSchema = new Schema({
  _id: field({ pkey: true }),
  kind: String,
  name: String,
  brandId: String,
  channelIds: [String],
  accountId: String,
  erxesApiId: String,
  phoneNumber: field({
    type: String,
    label: 'CallPro phone number',
    optional: true
  }),
  recordUrl: field({
    type: String,
    label: 'CallPro record url',
    optional: true
  }),
  email: String,
  expiration: String,
  healthStatus: String,
  error: String
});

export interface IIntegrationModel extends Model<IIntegrationDocument> {
  getIntegration(selector): Promise<IIntegrationDocument>;
}

export const loadClass = () => {
  class Integration {
    public static async getIntegration(selector) {
      const integration = await Integrations.findOne(selector);

      if (!integration) {
        throw new Error('Integration not found');
      }

      return integration;
    }
  }

  integrationSchema.loadClass(Integration);

  return integrationSchema;
};

loadClass();

// tslint:disable-next-line
const Integrations = model<IIntegrationDocument, IIntegrationModel>(
  'integrations',
  integrationSchema
);

export default Integrations;
