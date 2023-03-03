import { formatDate } from './../utils';
import { BaseApi } from './base';

export class StatementsApi extends BaseApi {
  public params;

  constructor(args) {
    super(args);
    this.params = args;
  }

  /**
   * get statement list
   * @param {string} accountNumber - account number
   * @param {Date} startDate - start date
   * @param {Date} endDate - end date
   * @param {number} page - page number
   * @param {number} perPage - per page
   * @param {number} record - record number
   * @return {[object]} - Returns an array of statements
   * TODO: update return type
   */
  async list(args: {
    accountNumber: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    perPage?: number;
    record?: number;
  }) {
    const { accountNumber, startDate, endDate, page, perPage, record } = args;

    let queryParams: any = {};

    if (startDate) {
      queryParams.from = formatDate(startDate);
      delete queryParams.record;
    }

    if (endDate) {
      queryParams.to = formatDate(endDate);
      delete queryParams.record;
    }

    if (page) {
      queryParams.page = page;
    }

    if (perPage) {
      queryParams.size = perPage;
    }

    if (record) {
      queryParams.record = record;
      delete queryParams.from;
      delete queryParams.to;
    }

    try {
      return await this.request({
        method: 'GET',
        path: `statements/${accountNumber}`,
        params: queryParams
      });
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }
}
