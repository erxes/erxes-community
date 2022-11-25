import { generateModels } from '../connectionResolver';
import { sendSalesplansMessage } from '../messageBroker';
import { FLOW_STATUSES } from '../models/definitions/constants';
import { IProcess, IWork } from '../models/definitions/processes';

const sendStatus = async (subdomain, result: { [key: string]: string[] }) => {
  for (const key of Object.keys(result)) {
    if (result[key].length) {
      await sendSalesplansMessage({
        subdomain,
        action: 'dayPlans.updateStatus',
        data: { _ids: result[key], status: key }
      });
    }
  }
};

const getWorks = () => {
  return [];
};

export const consumeSalesPlans = async (
  subdomain,
  {
    dayPlans,
    date,
    branchId,
    departmentId
  }: { date: Date; dayPlans: any[]; branchId: string; departmentId: string }
) => {
  const models = await generateModels(subdomain);

  const result: { [key: string]: string[] } = {
    noTimeFrames: [],
    noFlow: [],
    success: []
  };
  const dayPlanIds = dayPlans.map(dp => dp._id);

  const productIds = dayPlans.map(d => d.productId);
  const flows = await models.Flows.find({
    status: FLOW_STATUSES.ACTIVE,
    flowValidation: '',
    productId: { $in: productIds },
    latestBranchId: branchId,
    latestDepartmentId: departmentId
  });

  const flowByProducId = {};
  for (const flow of flows) {
    flowByProducId[flow._id] = flow;
  }

  const timeframes = await sendSalesplansMessage({
    subdomain,
    action: 'timeframes.find',
    data: { branchId, departmentId },
    isRPC: true
  });

  if (!timeframes.length) {
    result.noTimeFrames = dayPlanIds;
    await sendStatus(subdomain, result);
  }

  const timesById = {};
  for (const time of timeframes) {
    timesById[time._id] = time;
  }

  const bulkCreateProcesses: IProcess[] = [];
  for (const dayPlan of dayPlans) {
    const { productId, values } = dayPlan;

    const flow = flowByProducId[productId];
    if (!flow) {
      result.noFlow.push(dayPlan._id);
      continue;
    }

    for (const value of values) {
      const { timeId, count } = value;

      let time = timesById[timeId];

      if (!time) {
        time = timeframes[0];
      }

      const works: IWork[] = await getWorks();

      bulkCreateProcesses.push({
        flowId: flow._id,
        dueDate: new Date(new Date(date).setHours(time.startTime)),
        branchId,
        departmentId,
        productId,
        quantity: count,
        status: 'string',
        isSub: false,
        works
      });
    }
  }

  await sendStatus(subdomain, result);
  return {};
};
