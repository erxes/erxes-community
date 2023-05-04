import { Model } from 'mongoose';
import {
  IRCFAQuestionsDocument,
  rcfaQuestionsSchema
} from './definitions/rcfa';
import { IModels } from '../connectionResolver';

export interface IRCFAModel extends Model<IRCFAQuestionsDocument> {
  addRCFA(doc: any): Promise<IRCFAQuestionsDocument>;
}

export const loadRCFAClass = (models: IModels, subdomain: string) => {
  class RCFA {
    addRCFA(doc) {
      return '';
    }
  }

  rcfaQuestionsSchema.loadClass(RCFA);

  return rcfaQuestionsSchema;
};
