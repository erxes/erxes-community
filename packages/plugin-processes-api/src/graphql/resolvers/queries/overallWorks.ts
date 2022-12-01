import { paginate } from '@erxes/api-utils/src/core';
// import {
//   checkPermission,
//   requireLogin
// } from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';

interface IParam {
  searchValue?: string;
  inBranchId?: string;
  inDepartmentId?: string;
  outBranchId?: string;
  outDepartmentId?: string;
  ids: string[];
  excludeIds: boolean;
  id: string;
  jobReferId: string;
}

const generateFilter = (params: IParam, commonQuerySelector) => {
  const {
    searchValue,
    ids,
    id,
    excludeIds,
    inBranchId,
    inDepartmentId,
    outBranchId,
    outDepartmentId,
    jobReferId
  } = params;
  const selector: any = { ...commonQuerySelector };

  if (id) {
    selector._id = id;
  }

  if (searchValue) {
    selector.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  if (outBranchId && outDepartmentId) {
    selector.outBranchId = outBranchId;
    selector.outDepartmentId = outDepartmentId;
  }

  if (inBranchId && inDepartmentId) {
    selector.inBranchId = inBranchId;
    selector.inDepartmentId = inDepartmentId;
  }

  if (jobReferId) {
    selector.jobId = jobReferId;
  }

  if (ids && ids.length > 0) {
    selector._id = { [excludeIds ? '$nin' : '$in']: ids };
  }

  return selector;
};

const overallWorkQueries = {
  async overallWorks(
    _root,
    params: IParam & {
      page: number;
      perPage: number;
    },
    { models, commonQuerySelector }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);
    await models.Works.aggregate([
      { $match: selector },
      { $sort: { dueDate: 1 } },
      {
        $project: {
          _id: 1,
          inBranchId: 1,
          inDepartmentId: 1,
          outBranchId: 1,
          outDepartmentId: 1,
          dueDate: 1,
          needProducts: 1,
          resultProducts: 1,
          type: 1,
          typeId: 1
        }
      },
      {
        $group: {
          _id: {
            inBranchId: '$inBranchId',
            inDepartmentId: '$inDepartmentId',
            outBranchId: '$outBranchId',
            outDepartmentId: '$outDepartmentId',
            type: '$type',
            typeId: '$typeId'
          },
          needProducts: { $push: '$needProducts' },
          resultProducts: { $push: '$resultProducts' }
        }
      }
    ]);
    return paginate(models.OverallWorks.find(selector).lean(), { ...params });
  },

  overallWorksSideBar(
    _root,
    params: IParam,
    { models, commonQuerySelector }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);
    return models.OverallWorks.find(selector).lean();
  },

  overallWorksSideBarDetail(
    _root,
    params: IParam,
    { models, commonQuerySelector }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);
    return models.OverallWorks.findOne(selector).lean();
  },

  overallWorksTotalCount(
    _root,
    params: IParam,
    { commonQuerySelector, models }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);

    return models.OverallWorks.find(selector).count();
  }
};

// checkPermission(overallWorkQueries, 'overalWorks', 'showWorks');

export default overallWorkQueries;
