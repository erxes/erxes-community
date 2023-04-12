import { gatherDescriptions } from '../../../utils';
import {
  checkPermission,
  putCreateLog,
  putDeleteLog,
  putUpdateLog
} from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import messageBroker from '../../../messageBroker';

const insuranceTypeMutations = {
  insuranceTypesAdd: async (
    _root,
    doc,
    { user, docModifier, models, subdomain }: IContext
  ) => {
    doc.yearPercents = doc.yearPercents.split(', ');

    //TODO check this method
    const insuranceType = models.InsuranceTypes.createInsuranceType(
      models,
      docModifier(doc)
    );

    const descriptions = gatherDescriptions({
      type: 'insuranceType',
      newData: doc,
      object: insuranceType,
      extraParams: { models }
    });

    await putCreateLog(
      subdomain,
      messageBroker,
      {
        type: 'insuranceType',
        newData: doc,
        object: insuranceType,
        extraParams: { models },
        ...descriptions
      },
      user
    );

    return insuranceType;
  },
  /**
   * Updates a insuranceType
   */

  insuranceTypesEdit: async (
    _root,
    { _id, ...doc },
    { models, user, subdomain }: IContext
  ) => {
    doc.yearPercents = doc.yearPercents.split(', ');
    const insuranceType = await models.InsuranceTypes.getInsuranceType(models, {
      _id
    });
    const updated = await models.InsuranceTypes.updateInsuranceType(
      models,
      _id,
      doc
    );
    const descriptions = gatherDescriptions({
      type: 'insuranceType',
      object: insuranceType,
      newData: { ...doc },
      updatedDocument: updated,
      extraParams: { models }
    });
    await putUpdateLog(
      subdomain,
      messageBroker,
      {
        type: 'insuranceType',
        object: insuranceType,
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
   * Removes insuranceTypes
   */
  insuranceTypesRemove: async (
    _root,
    { insuranceTypeIds }: { insuranceTypeIds: string[] },
    { models, user, subdomain }: IContext
  ) => {
    // TODO: contracts check
    const insuranceTypes = await models.InsuranceTypes.find({
      _id: { $in: insuranceTypeIds }
    }).lean();

    await models.InsuranceTypes.removeInsuranceTypes(models, insuranceTypeIds);

    for (const insuranceType of insuranceTypes) {
      const descriptions = gatherDescriptions({
        type: 'insuranceType',
        object: insuranceType,
        extraParams: { models }
      });
      await putDeleteLog(
        subdomain,
        messageBroker,
        {
          type: 'insuranceType',
          object: insuranceType,
          extraParams: { models },
          ...descriptions
        },
        user
      );
    }

    return insuranceTypeIds;
  }
};
checkPermission(
  insuranceTypeMutations,
  'insuranceTypesAdd',
  'manageInsuranceTypes'
);
checkPermission(
  insuranceTypeMutations,
  'insuranceTypesEdit',
  'manageInsuranceTypes'
);
checkPermission(
  insuranceTypeMutations,
  'insuranceTypesRemove',
  'manageInsuranceTypes'
);

export default insuranceTypeMutations;
