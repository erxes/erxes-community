import { gatherDescriptions } from '../../../utils';
import {
  checkPermission,
  putCreateLog,
  putDeleteLog,
  putUpdateLog
} from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import messageBroker from '../../../messageBroker';
import {
  IAdjustment,
  IAdjustmentDocument
} from '../../../models/definitions/adjustments';

const adjustmentMutations = {
  adjustmentsAdd: async (
    _root,
    doc: IAdjustment,
    { user, docModifier, models, subdomain }: IContext
  ) => {
    doc.createdBy = user._id;
    const adjustment = models.Adjustments.createAdjustment(docModifier(doc));

    const logData = {
      type: 'adjustment',
      object: adjustment,
      extraParams: { models }
    };

    const descriptions = gatherDescriptions(logData);

    await putCreateLog(
      subdomain,
      messageBroker,
      {
        newData: doc,
        ...logData,
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
    { _id, ...doc }: IAdjustmentDocument,
    { models, user, subdomain }: IContext
  ) => {
    const adjustment = await models.Adjustments.getAdjustment({ _id });
    const updated = await models.Adjustments.updateAdjustment(_id, doc);

    const logData = {
      type: 'adjustment',
      object: adjustment,
      extraParams: { models }
    };

    const descriptions = gatherDescriptions(logData);

    await putUpdateLog(
      subdomain,
      messageBroker,
      {
        newData: { ...doc },
        updatedDocument: updated,
        ...logData,
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
      const logData = {
        type: 'adjustment',
        object: adjustment,
        extraParams: { models }
      };

      const descriptions = gatherDescriptions(logData);
      await putDeleteLog(
        subdomain,
        messageBroker,
        {
          ...logData,
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
