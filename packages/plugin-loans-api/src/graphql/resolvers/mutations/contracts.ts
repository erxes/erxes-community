import {
  ICollateralData,
  IContract,
  IContractDocument
} from '../../../models/definitions/contracts';
import { gatherDescriptions } from '../../../utils';
import { ConfirmBase } from '../../../models/utils/confirmContractUtils';
import {
  checkPermission,
  putCreateLog,
  putDeleteLog,
  putUpdateLog
} from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import messageBroker, {
  sendCardsMessage,
  sendCoreMessage,
  sendMessageBroker
} from '../../../messageBroker';
import redis from '../../../redis';
import { CONTRACT_STATUS } from '../../../models/definitions/constants';

const contractMutations = {
  contractsAdd: async (
    _root,
    doc: IContract,
    { user, models, subdomain }: IContext
  ) => {
    const contract = models.Contracts.createContract(doc);

    const logData = {
      type: 'contract',
      newData: doc,
      object: contract,
      extraParams: { models }
    };

    const descriptions = gatherDescriptions(logData);

    await putCreateLog(
      subdomain,
      messageBroker,
      {
        ...logData,
        ...descriptions
      },
      user
    );

    return contract;
  },

  /**
   * Updates a contract
   */

  contractsEdit: async (
    _root,
    { _id, ...doc }: IContractDocument,
    { models, user, subdomain }: IContext
  ) => {
    const contract = await models.Contracts.getContract({ _id });
    const updated = await models.Contracts.updateContract(_id, doc);

    const logData = {
      type: 'contract',
      object: contract,
      newData: { ...doc },
      updatedDocument: updated,
      extraParams: { models }
    };

    const descriptions = gatherDescriptions(logData);

    await putUpdateLog(
      subdomain,
      messageBroker,
      {
        ...logData,
        ...descriptions
      },
      user
    );

    return updated;
  },

  /**
   * to close contract
   */

  contractsClose: async (_root, doc, { models, user, subdomain }: IContext) => {
    const contract = await models.Contracts.getContract({
      _id: doc.contractId
    });
    const updated = await models.Contracts.closeContract(
      messageBroker,
      redis,
      doc
    );

    const logData = {
      type: 'contract',
      object: contract,
      newData: doc,
      updatedDocument: updated,
      extraParams: { models }
    };

    const descriptions = gatherDescriptions(logData);

    await putUpdateLog(
      subdomain,
      messageBroker,
      {
        ...logData,
        ...descriptions
      },
      user
    );

    return updated;
  },

  /**
   * Removes contracts
   */

  contractsRemove: async (
    _root,
    { contractIds }: { contractIds: string[] },
    { models, user, subdomain }: IContext
  ) => {
    const contracts = await models.Contracts.find({
      _id: { $in: contractIds }
    }).lean();

    await models.Contracts.removeContracts(contractIds);

    for (const contract of contracts) {
      const logData = {
        type: 'contract',
        object: contract,
        extraParams: { models }
      };
      const descriptions = gatherDescriptions(logData);
      await putDeleteLog(
        subdomain,
        messageBroker,
        { ...logData, ...descriptions },
        user
      );
    }

    return contractIds;
  },

  /**
   * from deal productsData
   */

  getProductsData: async (
    _root,
    { contractId }: { contractId: string },
    { models, subdomain }: IContext
  ) => {
    const contract = await models.Contracts.getContract({
      _id: contractId
    });

    const dealIds = await sendCoreMessage({
      subdomain,
      action: 'conformities.savedConformity',
      data: {
        mainType: 'contract',
        relTypes: ['deal'],
        mainTypeId: contract._id
      },
      isRPC: true
    });

    if (!dealIds) {
      return contract;
    }

    const deals = await sendCardsMessage({
      subdomain,
      action: 'deals.find',
      data: { _id: { $in: dealIds } },
      isRPC: true
    });

    const oldCollateralIds = contract.collateralsData.map(
      item => item.collateralId
    );

    const collateralsData: ICollateralData[] = contract.collateralsData;

    for (const deal of deals) {
      for (const data of deal.productsData) {
        if (oldCollateralIds.includes(data.productId)) continue;

        for (let i = 0; i < data.quantity; i++) {
          collateralsData.push({
            collateralId: data.productId,
            cost: data.unitPrice,
            percent: 100,
            marginAmount: 0,
            leaseAmount: 0
          });
        }
      }
    }

    const collaterals: any = [];

    for (const data of collateralsData || []) {
      const collateral = await sendMessageBroker(
        {
          subdomain,
          action: 'findOne',
          data: { _id: data.collateralId },
          isRPC: true
        },
        'products'
      );

      const insuranceType = await models.InsuranceTypes.findOne({
        _id: data.insuranceTypeId
      });

      collaterals.push({
        ...data,
        collateral,
        insuranceType
      });
    }

    // return collaterals;

    return { collateralsData: collaterals };
  },

  /**
   * Confirm lending of contracts
   */

  contractConfirm: async (
    _root,
    { contractId }: { contractId: string },
    { models }: IContext
  ) => {
    const contract: IContractDocument = await models.Contracts.getContract({
      _id: contractId
    });

    if (!contract.number) {
      throw new Error('Number is required');
    }

    const schedules = await models.Schedules.find({
      contractId
    }).lean();
    if (!schedules || !schedules.length) {
      throw new Error('Schedules are undefined');
    }

    return {
      result: await models.Contracts.updateOne(
        { _id: contractId },
        { $set: { status: CONTRACT_STATUS.NORMAL } }
      )
    };

    return {
      result: await ConfirmBase(models, messageBroker, redis, contract)
    };
  }
};

checkPermission(contractMutations, 'contractsAdd', 'manageContracts');
checkPermission(contractMutations, 'contractsEdit', 'manageContracts');
checkPermission(contractMutations, 'contractsClose', 'manageContracts');
checkPermission(contractMutations, 'contractsRemove', 'manageContracts');
checkPermission(contractMutations, 'getProductsData', 'manageContracts');
checkPermission(contractMutations, 'contractConfirm', 'manageContracts');

export default contractMutations;
