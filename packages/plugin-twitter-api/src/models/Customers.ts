import { Document, Model, model, Schema } from 'mongoose';
import { field } from '../models/utils';

export interface ICustomer {
  // id on erxes-api
  erxesApiId?: string;
  userId: string;
  integrationId: string;

  name: string;
  screenName: string;
  profilePic;
  string;
}
export interface ICustomerDocument extends ICustomer, Document {}

export const customerSchema = new Schema({
  _id: field({ pkey: true }),
  userId: { type: String, unique: true },
  // not integrationId on erxes-api
  integrationId: String,
  erxesApiId: String,

  name: String,
  screenName: String,
  profilePic: String
});

export interface ICustomerModel extends Model<ICustomerDocument> {}
export const Customers = model<ICustomerDocument, ICustomerModel>(
  'twitter_customerss',
  customerSchema
);
