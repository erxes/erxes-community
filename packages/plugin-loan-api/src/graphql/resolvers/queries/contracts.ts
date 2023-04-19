import { paginate } from 'erxes-api-utils';
import { getCloseInfo } from '../../../models/utils/closeUtils';
import { getFullDate } from '../../../models/utils/utils';
import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import redis from '../../../redis';
import { sendMessageBroker } from '../../../messageBroker';
import { ICustomer } from '@erxes/ui-contacts/src/customers/types';
import { ICompany } from '@erxes/ui-contacts/src/companies/types';

const generateFilter = async (models, params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;

  filter.status = { $ne: 'Deleted' };

  if (params.searchValue) {
    filter.number = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] };
  }

  // if (params.ids) {
  //   filter._id = { $in: params.ids };
  // }

  if (params.closeDate) {
    const date = getFullDate(params.closeDate);
    filter.closeDate = {
      $gte: date,
      $lte: new Date(date.getTime() + 1000 * 3600 * 24)
    };
  }

  if (
    params.conformityMainTypeId &&
    params.conformityMainType &&
    params.conformityIsSaved
  ) {
    filter._id = {
      $in: await models.Conformities.savedConformity({
        mainType: params.conformityMainType,
        mainTypeId: params.conformityMainTypeId,
        relTypes: ['contract', 'contractSub']
      })
    };
  }
  if (
    params.conformityMainTypeId &&
    params.conformityMainType &&
    params.conformityIsRelated
  ) {
    let ids = [];
    ids = ids.concat(
      await models.Conformities.relatedConformity({
        mainType: params.conformityMainType,
        mainTypeId: params.conformityMainTypeId,
        relType: 'contract'
      })
    );
    ids = ids.concat(
      await models.Conformities.relatedConformity({
        mainType: params.conformityMainType,
        mainTypeId: params.conformityMainTypeId,
        relType: 'contractSub'
      })
    );
    filter._id = { $in: ids };
  }

  if (params.contractTypeId) {
    filter.contractTypeId = params.contractTypeId;
  }

  return filter;
};

export const sortBuilder = params => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const contractQueries = {
  /**
   * Contracts list
   */

  contracts: async (
    _root,
    params,
    { commonQuerySelector, models, checkPermission, user }
  ) => {
    return paginate(
      models.Contracts.find(
        await generateFilter(models, params, commonQuerySelector)
      ),
      {
        page: params.page,
        perPage: params.perPage
      }
    );
  },

  /**
   * Contracts for only main list
   */

  contractsMain: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    const filter = await generateFilter(models, params, commonQuerySelector);

    return {
      list: paginate(models.Contracts.find(filter).sort(sortBuilder(params)), {
        page: params.page,
        perPage: params.perPage
      }),
      totalCount: models.Contracts.find(filter).count()
    };
  },

  /**
   * Get one contract
   */

  contractDetail: async (_root, { _id }, { models }: IContext) => {
    return models.Contracts.getContract({ _id });
  },
  cpContracts: async (_root, params, { models, subdomain }: IContext) => {
    const mainType = params.cpUserType || 'customer';
    if (mainType === 'customer') {
      const customer: ICustomer = await sendMessageBroker(
        {
          subdomain,
          action: 'customers.findOne',
          isRPC: true,
          data: {
            email: params.cpUserEmail,
            phone: params.cpUserPhone
          }
        },
        'contacts'
      );

      return models.Contracts.find({
        customerId: customer._id
      }).sort({
        createdAt: -1
      });
    }

    var company: ICompany = await sendMessageBroker(
      {
        subdomain,
        action: 'companies.findOne',
        isRPC: true,
        data: {
          email: params.cpUserEmail,
          phone: params.cpUserPhone
        }
      },
      'contacts'
    );

    if (!company) {
      company = await sendMessageBroker(
        {
          subdomain,
          action: 'companies.findOne',
          isRPC: true,
          data: {
            $or: [
              { phones: { $in: [params.cpUserPhone] } },
              { primaryPhone: params.cpUserPhone }
            ]
          }
        },
        'contacts'
      );
    }

    if (!company) {
      return [];
    }

    return models.Contracts.find({ customerId: company._id }).sort({
      createdAt: -1
    });
  },

  cpContractDetail: async (_root, { _id }, { models }: IContext) => {
    return models.Contracts.getContract({ _id });
  },

  closeInfo: async (_root, { contractId, date }, { models }: IContext) => {
    const contract = await models.Contracts.getContract({
      _id: contractId
    });
    return getCloseInfo(models, redis, contract, date);
  }
};

checkPermission(contractQueries, 'contractsMain', 'showContracts');
checkPermission(contractQueries, 'contractDetail', 'showContracts');
checkPermission(contractQueries, 'contracts', 'showContracts');

export default contractQueries;
