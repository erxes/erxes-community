import { scheduleSchema } from './definitions/schedules';
import { IScheduleDocument } from '../models/definitions/schedules';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
export interface IScheduleModel extends Model<IScheduleDocument> {
  getSchedule(selector: any);
  createSchedule(doc);
  updateSchedule(_id, doc);
  removeSchedule(_id);
}
export const loadScheduleClass = (models: IModels) => {
  class Schedule {
    /**
     *
     * Get Schedule Cagegory
     */

    public static async getSchedule(selector: any) {
      const schedule = await models.Schedules.findOne(selector);

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      return schedule;
    }

    /**
     * Create a schedule
     */
    public static async createSchedule(doc) {
      return models.Schedules.create(doc);
    }

    /**
     * Update Schedule
     */
    public static async updateSchedule(_id, doc) {
      await models.Schedules.updateOne({ _id }, { $set: doc });

      return models.Schedules.findOne({ _id });
    }

    /**
     * Remove Schedule
     */
    public static async removeSchedule(_id) {
      await models.Schedules.getSchedule({ _id });

      return models.Schedules.deleteOne({ _id });
    }
  }
  scheduleSchema.loadClass(Schedule);
  return scheduleSchema;
};
