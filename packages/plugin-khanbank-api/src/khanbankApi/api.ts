import { IModels } from './../connectionResolver';
import { sendRequest } from '@erxes/api-utils/src/requests';
import { ACTIONS } from './constants';

export const authenticate = async (models: IModels, configId: string) => {
  const apiUrl = `${process.env.KHANBANK_API_URL}/${process.env.KHANBANK_API_VERSION}`;

  const config = await models.KhanbankConfigs.getConfig({ _id: configId });

  const { consumerKey, secretKey } = config;

  try {
    const response = await sendRequest({
      url: `${apiUrl}${ACTIONS.AUTH}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${consumerKey}:${secretKey}`
        ).toString('base64')}`
      }
    });

    return response;
  } catch (e) {
    console.error('AUTHH ', e.message);
    throw new Error(e.message);
  }
};

export const apiRequest = async (
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
      url: `${apiUrl}${action}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`
      },
      body: data
    };

    return sendRequest(requestOptions);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAccounts = async (models: IModels, configId: string) => {
  const action = `${ACTIONS.ACCOUNTS}`;

  try {
    const res = await apiRequest(models, configId, 'GET', action);

    return res.accounts;
  } catch (e) {
    console.error('ACCOUNTS = ', e.message);

    throw new Error(e.message);
  }
};
