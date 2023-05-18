import { Model } from 'mongoose';
import {
  IRCFAQuestionsDocument,
  rcfaQuestionsSchema
} from './definitions/question';
import { IModels } from '../connectionResolver';

export interface IRCFAQuestionModel extends Model<IRCFAQuestionsDocument> {
  addRCFA(doc: any): Promise<IRCFAQuestionsDocument>;
}

export const loadRCFAQuestionClass = (models: IModels, subdomain: string) => {
  class RCFA {
    addRCFA(doc: any) {
      return '';
    }
  }

  rcfaQuestionsSchema.loadClass(RCFA);

  return rcfaQuestionsSchema;
};
