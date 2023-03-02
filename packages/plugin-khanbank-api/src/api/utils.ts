import { IModels } from '../connectionResolver';
import { sendRequest } from '@erxes/api-utils/src/requests';
import { ACTIONS } from './constants';

/**
 * Authenticate with Khanbank API
 * @param {object} models - Models
 * @param {string} configId - corporate gateway config id on erxes
 * @return {string} - Returns an access token
 * @throws {Error} - Throws an error if authentication failed
 */
const authenticate = async (models: IModels, configId: string) => {
  const apiUrl = `${process.env.KHANBANK_API_URL}/${process.env.KHANBANK_API_VERSION}`;

  const config = await models.KhanbankConfigs.getConfig({ _id: configId });

  const { consumerKey, secretKey } = config;

  try {
    const response = await sendRequest({
      url: `${apiUrl}/${ACTIONS.AUTH}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${consumerKey}:${secretKey}`
        ).toString('base64')}`
      }
    });

    console.log('response', response);

    return response.access_token;
  } catch (e) {
    throw new Error('Authentication failed');
  }
};

/**
 * Make a request to Khanbank API
 * @param {object} models - Models
 * @param {string} configId - corporate gateway config id on erxes
 * @param {string} method - HTTP method
 * @param {string} action - API action
 * @param {object} data - Request body
 * @return {Promise} - Returns a promise
 * @throws {Error} - Throws an error if request failed
 */
const makeApiCall = async (
  models: IModels,
  configId: string,
  method: string,
  action: string,
  data?: any
) => {
  const apiUrl = `${process.env.KHANBANK_API_URL}/${process.env.KHANBANK_API_VERSION}`;

  try {
    const token = await authenticate(models, configId);
    const requestOptions = {
      url: `${apiUrl}/${action}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: data
    };

    return sendRequest(requestOptions);
  } catch (e) {
    console.error('makeApiCall', e);
    throw new Error(e.message);
  }
};

export default {
  authenticate,
  makeApiCall
};
