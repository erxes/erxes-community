import { gatherDescriptions } from '../../../utils';
import {
  checkPermission,
  putCreateLog,
  putDeleteLog,
  putUpdateLog
} from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import messageBroker from '../../../messageBroker';

const adjustmentMutations = {
  adjustmentsAdd: async (
    _root,
    doc,
    { user, docModifier, models, subdomain }: IContext
  ) => {
    doc.createdBy = user._id;
    const adjustment = models.Adjustments.createAdjustment(docModifier(doc));

    const descriptions = gatherDescriptions({
      type: 'adjustment',
      newData: doc,
      object: adjustment,
      extraParams: { models }
    });

    await putCreateLog(
      subdomain,
      messageBroker,
      {
        type: 'adjustment',
        newData: doc,
        object: adjustment,
        extraParams: { models },
        ...descriptions
      },
      user
    );

    return adjustment;
  },
  /**
   * Updates a adjustment
   */
  adjustmentsEdit: async (
    _root,
    { _id, ...doc },
    { models, user, subdomain }: IContext
  ) => {
    const adjustment = await models.Adjustments.getAdjustment({ _id });
    const updated = await models.Adjustments.updateAdjustment(_id, doc);
    const descriptions = gatherDescriptions({
      type: 'adjustment',
      object: adjustment,
      newData: { ...doc },
      updatedDocument: updated,
      extraParams: { models }
    });
    await putUpdateLog(
      subdomain,
      messageBroker,
      {
        type: 'adjustment',
        object: adjustment,
        newData: { ...doc },
        updatedDocument: updated,
        extraParams: { models },
        ...descriptions
      },
      user
    );

    return updated;
  },

  /**
   * Removes adjustments
   */

  adjustmentsRemove: async (
    _root,
    { adjustmentIds }: { adjustmentIds: string[] },
    { models, user, subdomain }: IContext
  ) => {
    // TODO: contracts check
    const adjustments = await models.Adjustments.find({
      _id: { $in: adjustmentIds }
    }).lean();

    await models.Adjustments.removeAdjustments(adjustmentIds);

    for (const adjustment of adjustments) {
      const descriptions = gatherDescriptions({
        type: 'adjustment',
        object: adjustment,
        extraParams: { models }
      });
      await putDeleteLog(
        subdomain,
        messageBroker,
        {
          type: 'adjustment',
          object: adjustment,
          extraParams: { models },
          ...descriptions
        },
        user
      );
    }

    return adjustmentIds;
  }
};

checkPermission(adjustmentMutations, 'adjustmentsAdd', 'manageContracts');
checkPermission(adjustmentMutations, 'adjustmentsEdit', 'manageContracts');
checkPermission(adjustmentMutations, 'adjustmentsRemove', 'manageContracts');

export default adjustmentMutations;
