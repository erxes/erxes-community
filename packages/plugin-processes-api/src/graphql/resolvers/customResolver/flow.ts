import { JOB_TYPES } from '../../../models/definitions/constants';
import { IContext } from '../../../connectionResolver';
import { sendProductsMessage } from '../../../messageBroker';
import { IFlow } from '../../../models/definitions/flows';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Flows.findOne({ _id });
  },

  async product(flow: IFlow, {}, { subdomain }: IContext) {
    return (
      (await sendProductsMessage({
        subdomain,
        action: 'findOne',
        data: { _id: flow.productId || '' },
        isRPC: true
      })) || undefined
    );
  },

  async jobCount(flow: IFlow, {}, {}: IContext) {
    return (flow.jobs || []).length;
  },

  async resultProducs(flow: IFlow, {}, {}: IContext) {
    const endJobs = (flow.jobs || []).filter(
      j => !j.nextJobIds || !j.nextJobIds.length
    );

    const resultProducts = [];
    const jobReferIds: string[] = [];
    const productIds: string[] = [];
    const subFlowIds: string[] = [];

    for (const job of endJobs) {
      const config = job.config;
      if ([JOB_TYPES.ENDPOINT, JOB_TYPES.JOB].includes(job.type)) {
        if (config.jobReferId) {
          jobReferIds.push(config.jobReferId);
        }
      }

      if ([JOB_TYPES.MOVE, JOB_TYPES.INCOME].includes(job.type)) {
        if (config.productId) {
          productIds.push(config.productId);
        }
      }

      if (job.type === JOB_TYPES.FLOW) {
        if (config.subFlowId) {
          subFlowIds.push(config.subFlowId);
        }
      }
    }

    // const { productById, uomById } = await getProductAndUoms(
    //   subdomain,
    //   resultProducts
    // );

    // for await (const result of resultProducts) {
    //   result.product = productById[result.productId] || {};
    //   result.uom = uomById[result.uomId] || {};
    // }

    return resultProducts;
  }
};
