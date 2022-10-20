import { Model } from 'mongoose';
import * as _ from 'underscore';
import { IModels } from '../connectionResolver';
import { IFlow, IFlowDocument, flowSchema, IJob } from './definitions/flows';
import { FLOWJOB_TYPES } from '../../../plugin-processes-ui/src/flow/constants';

export interface IFlowModel extends Model<IFlowDocument> {
  getFlow(_id: string): Promise<IFlowDocument>;
  createFlow(doc: IFlow): Promise<IFlowDocument>;
  updateFlow(_id: string, doc: IFlow): Promise<IFlowDocument>;
  removeFlow(_id: string): void;
  removeFlows(flowIds: string[]): void;
  checkValidation(jobs?: IJob[]): Promise<Boolean>;
}

export const loadFlowClass = (models: IModels) => {
  class Flow {
    /*
     * Get a flow
     */
    public static async getFlow(_id: string) {
      const flow = await models.Flows.findOne({ _id });

      if (!flow) {
        throw new Error('Flow not found');
      }

      return flow;
    }

    public static async checkValidation(jobs?: IJob[]) {
      if (!jobs || !jobs.length) {
        return 'Has not jobs';
      }

      const endJobs = jobs.filter(j => j.type === FLOWJOB_TYPES.ENDPOINT);
      if (!endJobs || !endJobs.length) {
        return 'Has not endPoint job';
      }

      if (endJobs.length > 1) {
        return 'Many endPoint jobs';
      }

      const latestJobs = jobs.filter(
        j => !j.nextJobIds || !j.nextJobIds.length
      );
      if (!latestJobs || !latestJobs.length) {
        return 'Has not endPoint job';
      }

      if (latestJobs.length > 1) {
        return 'Many endPoint jobs';
      }

      return '';
    }

    /**
     * Create a flow
     */
    public static async createFlow(doc: IFlow) {
      const flow = await models.Flows.create({
        ...doc,
        createdAt: new Date()
      });

      return flow;
    }

    /**
     * Update Flow
     */
    public static async updateFlow(_id: string, doc: IFlow) {
      const flowValidation = await models.Flows.checkValidation(doc.jobs);

      await models.Flows.updateOne(
        { _id },
        { $set: { ...doc, flowValidation } }
      );

      const updated = await models.Flows.getFlow(_id);

      return updated;
    }

    /**
     * Remove Flow
     */
    public static async removeFlow(_id: string) {
      await models.Flows.getFlow(_id);
      return models.Flows.deleteOne({ _id });
    }

    /**
     * Remove Flows
     */
    public static async removeFlows(flowIds: string[]) {
      await models.Flows.deleteMany({ _id: { $in: flowIds } });

      return 'deleted';
    }
  }

  flowSchema.loadClass(Flow);

  return flowSchema;
};
