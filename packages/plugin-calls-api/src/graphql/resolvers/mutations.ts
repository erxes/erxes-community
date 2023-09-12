import { Types } from '../../models';
import * as jwt from 'jsonwebtoken';
import { generateToken } from '../../utils';
import { IContext } from '../../connectionResolver';
import { ICalls } from '../../models/definitions/calls';

interface ICallsEdit extends ICalls {
  _id: string;
}

const callsMutations = {
  /**
   * Creates a new calls
   */
  async callssAdd(_root, doc, { models }: IContext) {
    return models.Calls.createCalls(doc);
  },

  /**
   * Edits a new calls
   */
  async callssEdit(_root, { _id, ...doc }: ICallsEdit, { models }: IContext) {
    return models.Calls.updateCalls(_id, doc);
  },

  /**
   * Removes a single calls
   */
  async callssRemove(_root, { _id }, { models }: IContext) {
    return models.Calls.removeCalls(_id);
  },

  /**
   * Creates a new type for calls
   */
  async callsTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async callsTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async callsTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  },

  async callsIntegrationUpdate(_root, { configs }, { models }: IContext) {
    const { inboxId, ...data } = configs;
    const token = await generateToken(inboxId);

    const integration = await models.Integrations.findOneAndUpdate(
      { inboxId },
      { $set: { ...data, token } }
    );
    return integration;
  }
};

export default callsMutations;
