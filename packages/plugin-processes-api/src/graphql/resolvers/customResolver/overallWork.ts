import {
  IOverallProductsData,
  IOverallWork
} from './../../../models/definitions/overallWorks';
import { IContext } from '../../../connectionResolver';
import { sendCoreMessage } from '../../../messageBroker';
import { IJobRefer } from '../../../models/definitions/jobs';

const getProductsData = productsData => {
  const quantityByKey = {};
  const result: IOverallProductsData[] = [];

  for (const perProductsData of productsData) {
    for (const productData of perProductsData) {
      const key = `${productData.productId}_${productData.uomId}`;
      if (!Object.keys(quantityByKey)) {
        quantityByKey[key] = 0;
      }

      quantityByKey[key] = quantityByKey[key] + productData.quantity;
    }
  }

  for (const key of Object.keys(quantityByKey)) {
    const [productId, uomId] = key.split('_');
    result.push({
      productId,
      uomId,
      quantity: quantityByKey[key]
    });
  }
  return result;
};

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Works.findOne({ _id });
  },

  async type(work: IOverallWork, {}, {}) {
    const { key } = work;
    const { type } = key;
    return type;
  },

  async job(work: IOverallWork, {}, { models }: IContext) {
    const { jobId } = work;
    const jobRefer: IJobRefer | null = await models.JobRefers.findOne({
      _id: jobId
    });

    return { label: jobRefer?.name || '', description: jobRefer?.code || '' };
  },

  async inBranch(work: IOverallWork, {}, { subdomain }: IContext) {
    const { key } = work;
    const { inBranchId } = key;

    if (!inBranchId) {
      return;
    }

    return await sendCoreMessage({
      subdomain,
      action: 'branches.findOne',
      data: { _id: inBranchId || '' },
      isRPC: true
    });
  },

  async outBranch(work: IOverallWork, {}, { subdomain }: IContext) {
    const { key } = work;
    const { outBranchId } = key;

    if (!outBranchId) {
      return;
    }

    return await sendCoreMessage({
      subdomain,
      action: 'branches.findOne',
      data: { _id: outBranchId || '' },
      isRPC: true
    });
  },

  async inDepartment(work: IOverallWork, {}, { subdomain }: IContext) {
    const { key } = work;
    const { inDepartmentId } = key;
    if (!inDepartmentId) {
      return;
    }

    return await sendCoreMessage({
      subdomain,
      action: 'departments.findOne',
      data: { _id: inDepartmentId || '' },
      isRPC: true
    });
  },

  async outDepartment(work: IOverallWork, {}, { subdomain }: IContext) {
    const { key } = work;
    const { outDepartmentId } = key;
    if (!outDepartmentId) {
      return;
    }

    return await sendCoreMessage({
      subdomain,
      action: 'departments.findOne',
      data: { _id: outDepartmentId || '' },
      isRPC: true
    });
  },

  async needProducts(overallWork: IOverallWork, {}, {}) {
    const { needProducts } = overallWork;

    if (!needProducts || !needProducts.length) {
      return [];
    }

    return getProductsData(needProducts);
  },

  async resultProducts(overallWork: IOverallWork, {}, {}) {
    const { resultProducts } = overallWork;

    if (!resultProducts || !resultProducts.length) {
      return [];
    }

    return getProductsData(resultProducts);
  }
};
