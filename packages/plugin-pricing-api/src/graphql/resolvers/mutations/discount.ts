import {
  moduleRequireLogin,
  moduleCheckPermission
} from '@erxes/api-utils/src/permissions';
import { IContext, models } from '../../../connectionResolver';
import {
  IDiscount,
  IDiscountDocument
} from '../../../models/definitions/discount';

const discountMutations = {
  discountAdd: async (
    _root: any,
    doc: IDiscount,
    { models, user }: IContext
  ) => {
    return await models.Discounts.discountAdd(doc, user._id);
  },

  discountEdit: async (
    _root: any,
    doc: IDiscountDocument,
    { models, user }: IContext
  ) => {
    return await models.Discounts.discountEdit(doc._id, doc, user._id);
  },

  discountRemove: async (_root: any, id: string, { models }: IContext) => {
    return await models.Discounts.discountRemove(id);
  }
};

export default discountMutations;
