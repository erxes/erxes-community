import { sendRequest } from '@erxes/api-utils/src';
import { IRequestParams } from '@erxes/api-utils/src/requests';

const ApiKey2: string = '50e486c1f867e4cc-faa151fa47843647-3312be901c5f82f7';

type AuthHeaderType = {
  'X-Viber-Auth-Token': string;
};

const authHeader: AuthHeaderType = {
  'X-Viber-Auth-Token': ApiKey2
};

interface RequestInterface extends IRequestParams {
  method: 'POST' | 'GET';
  headers: AuthHeaderType;
  url: string;
  body: object;
}

export const setWebhook = async (
  token: string,
  integrationId: string
): Promise<any> => {
  const url = `http://localhost:4000/pl:viber/webhook/${integrationId}`;

  const payload: RequestInterface = {
    method: 'POST',
    headers: {
      'X-Viber-Auth-Token': token
    },
    url: 'https://chatapi.viber.com/pa/set_webhook',
    body: {
      url,
      event_types: [
        'delivered',
        'seen',
        'failed',
        'subscribed',
        'unsubscribed',
        'conversation_started',
        'message'
      ],
      send_name: true,
      send_photo: true
    }
  };

  return await sendRequest(payload);
};

export const sendMessage = async (message: object): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/send_message',
    body: message
  };

  return await sendRequest(payload);
};

export const removeWebhook = async (): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/set_webhook',
    body: { url: '' }
  };

  return await sendRequest(payload);
};

export const broadcastMessage = async (body: object): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/broadcast_message',
    body
  };

  return await sendRequest(payload);
};

export const getAccountInfo = async (): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_account_info',
    body: {}
  };

  return await sendRequest(payload);
};

export const getUserDetail = async (userId: string): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_user_details',
    body: { id: userId }
  };

  return await sendRequest(payload);
};

export const getOnline = async (body: object): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_online',
    body
  };

  return await sendRequest(payload);
};
