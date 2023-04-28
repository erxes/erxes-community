import { checkPermission, paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { IAdjustmentDocument } from '../../../models/definitions/adjustments';

const generateFilter = async (params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;
  if (params.startDate) {
    filter.payDate = {
      $gte: new Date(params.startDate)
    };
  }

  if (params.endDate) {
    filter.payDate = {
      $lte: new Date(params.endDate)
    };
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

const adjustmentQueries = {
  /**
   * Adjustments list
   */

  adjustments: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    return paginate(
      models.Adjustments.find(
        await generateFilter(params, commonQuerySelector)
      ),
      {
        page: params.page,
        perPage: params.perPage
      }
    );
  },

  /**
   * Adjustments for only main list
   */

  adjustmentsMain: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    const filter = await generateFilter(params, commonQuerySelector);

    return {
      list: paginate(
        models.Adjustments.find(filter).sort(sortBuilder(params)),
        {
          page: params.page,
          perPage: params.perPage
        }
      ),
      totalCount: models.Adjustments.find(filter).count()
    };
  },

  /**
   * Get one adjustment
   */

  adjustmentDetail: async (
    _root,
    { _id }: IAdjustmentDocument,
    { models }: IContext
  ) => {
    return models.Adjustments.getAdjustment({ _id });
  }
};

checkPermission(adjustmentQueries, 'adjustments', 'showContracts');
checkPermission(adjustmentQueries, 'adjustmentsMain', 'showContracts');
checkPermission(adjustmentQueries, 'adjustmentDetail', 'showContracts');

export default adjustmentQueries;
