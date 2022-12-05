import {
  IOverallProductsData,
  IOverallWorkDocument
} from './../../../models/definitions/overallWorks';
import { IContext } from '../../../connectionResolver';
import { sendCoreMessage, sendProductsMessage } from '../../../messageBroker';
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

  async type(work: IOverallWorkDocument, {}, {}) {
    const { _id } = work;
    const { type } = _id;
    return type;
  },

  async job(work: IOverallWorkDocument, {}, { models }: IContext) {
    const { jobId } = work;
    const jobRefer: IJobRefer | null = await models.JobRefers.findOne({
      _id: jobId
    });

    return { label: jobRefer?.name || '', description: jobRefer?.code || '' };
  },

  async inBranch(work: IOverallWorkDocument, {}, { subdomain }: IContext) {
    const { _id } = work;
    const { inBranchId } = _id;

    return await sendCoreMessage({
      subdomain,
      action: 'branches.findOne',
      data: { _id: inBranchId || '' },
      isRPC: true
    });
  },

  async outBranch(work: IOverallWorkDocument, {}, { subdomain }: IContext) {
    const { _id } = work;
    const { outBranchId } = _id;

    return await sendCoreMessage({
      subdomain,
      action: 'branches.findOne',
      data: { _id: outBranchId || '' },
      isRPC: true
    });
  },

  async inDepartment(work: IOverallWorkDocument, {}, { subdomain }: IContext) {
    const { _id } = work;
    const { inDepartmentId } = _id;

    return await sendCoreMessage({
      subdomain,
      action: 'departments.findOne',
      data: { _id: inDepartmentId || '' },
      isRPC: true
    });
  },

  async outDepartment(work: IOverallWorkDocument, {}, { subdomain }: IContext) {
    const { _id } = work;
    const { outDepartmentId } = _id;

    return await sendCoreMessage({
      subdomain,
      action: 'departments.findOne',
      data: { _id: outDepartmentId || '' },
      isRPC: true
    });
  },

  async needProducts(overallWork: IOverallWorkDocument, {}, {}) {
    const { needProducts } = overallWork;

    if (!needProducts || !needProducts.length) {
      return [];
    }

    return getProductsData(needProducts);
  },

  async resultProducts(overallWork: IOverallWorkDocument, {}, {}) {
    const { resultProducts } = overallWork;

    if (!resultProducts || !resultProducts.length) {
      return [];
    }

    return getProductsData(resultProducts);
  }
};
