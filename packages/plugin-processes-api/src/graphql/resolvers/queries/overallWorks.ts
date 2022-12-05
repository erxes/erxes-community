import { getPureDate, getToday, getTomorrow } from '@erxes/api-utils/src/core';
// import {
//   checkPermission,
//   requireLogin
// } from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';

interface IParam {
  search: string;
  type: string;
  startDate: Date;
  endDate: Date;
  inBranchId: string;
  outBranchId: string;
  inDepartmentId: string;
  outDepartmentId: string;
  productCategoryId: string;
  productId: string;
  jobCategoryId: string;
  jobReferId: string;
}

const generateFilter = (params: IParam, commonQuerySelector) => {
  const {
    search,
    startDate,
    endDate,
    inBranchId,
    inDepartmentId,
    outBranchId,
    outDepartmentId,
    jobReferId,
    type
  } = params;
  const selector: any = { ...commonQuerySelector };

  const dueQry: any = {};
  if (startDate) {
    dueQry.$gte = getPureDate(startDate);
  }
  if (endDate) {
    dueQry.$lte = getPureDate(endDate);
  }
  if (Object.keys(dueQry).length) {
    selector.dueDate = dueQry;
  }

  if (search) {
    selector.name = new RegExp(`.*${search}.*`, 'i');
  }

  if (type) {
    selector.type = type;
  }

  if (outBranchId) {
    selector.outBranchId = outBranchId;
  }
  if (outDepartmentId) {
    selector.outDepartmentId = outDepartmentId;
  }

  if (inBranchId) {
    selector.inBranchId = inBranchId;
  }
  if (inDepartmentId) {
    selector.inDepartmentId = inDepartmentId;
  }

  if (jobReferId) {
    selector.jobId = jobReferId;
  }

  if (!Object.keys(selector).length) {
    const dueQry: any = {};
    dueQry.$gte = getPureDate(getToday(getPureDate(new Date(), -1)));
    dueQry.$lte = getPureDate(getTomorrow(getPureDate(new Date(), -1)));

    if (Object.keys(dueQry).length) {
      selector.dueDate = dueQry;
    }
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

    const { page = 0, perPage = 0 } = params;
    const _page = Number(page || '1');
    const _limit = Number(perPage || '20');

    const res = await models.Works.aggregate([
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
          typeId: 1,
          count: 1
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
          resultProducts: { $push: '$resultProducts' },
          workIds: { $push: '$_id' },
          count: { $sum: '$count' }
        }
      },
      {
        $skip: (_page - 1) * _limit
      },
      {
        $limit: _limit
      },
      {
        $project: {
          _id: {
            $concat: [
              '$_id.type',
              '_',
              '$_id.typeId',
              '_',
              '$_id.inBranchId',
              '_',
              '$_id.inDepartmentId',
              '_',
              '$_id.outBranchId',
              '_',
              '$_id.outDepartmentId'
            ]
          },
          key: '$_id',
          needProducts: 1,
          resultProducts: 1,
          workIds: 1,
          count: 1
        }
      }
    ]);

    return res;
  },

  async overallWorksCount(
    _root,
    params: IParam & {
      page: number;
      perPage: number;
    },
    { models, commonQuerySelector }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);

    const res = await models.Works.aggregate([
      { $match: selector },
      {
        $project: {
          _id: 1,
          inBranchId: 1,
          inDepartmentId: 1,
          outBranchId: 1,
          outDepartmentId: 1
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
          }
        }
      }
    ]);
    return res.length;
  }
};

// checkPermission(overallWorkQueries, 'overalWorks', 'showWorks');

export default overallWorkQueries;
