import { sendRequest } from '@erxes/api-utils/src/requests';
import { getAuthHeaders } from '../utils';

export class BaseApi {
  private config: any;

  constructor(config) {
    this.config = config;
  }

  async getHeaders() {
    return await getAuthHeaders(this.config);
  }

  get apiUrl() {
    return `${process.env.KHANBANK_API_URL}/${process.env.KHANBANK_API_VERSION}`;
  }

  async request(args: {
    method: string;
    path: string;
    params?: any;
    data?: any;
  }) {
    const { method, path, params, data } = args;

    try {
      const requestOptions = {
        url: `${this.apiUrl}/${path}`,
        params,
        method,
        headers: await this.getHeaders(),
        body: data
      };

      return sendRequest(requestOptions);
    } catch (e) {
      console.log('222222222');

      throw new Error(e.message);
    }
  }
}
