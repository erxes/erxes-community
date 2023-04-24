import { sendRequest } from '@erxes/api-utils/src';
import { IRequestParams } from '@erxes/api-utils/src/requests';

const ApiKey1: string = '50dfa9d00f67df44-cbcbe4fcc2f83742-d80626370fd9edff';
const boldId1: string = 'xKRVb9BFQEPU1KNU+d+ktw==';
const bold1: string = 'pa:5827563153917468484';

const ApiKey2: string = '50e486c1f867e4cc-faa151fa47843647-3312be901c5f82f7';
const boldId2: string = 'JfRXjsS4tUjvbEZhE6t2gg==';
const bold2: string = 'pa:5828931985378632908';

const enjiKey: string = '50e5d5cf29e7dc89-8d12405dd4a2fb3f-ea2d189a334f469e';
const enjiId: string = '+bXrAhvAr7+OOdFB5Pfywg==';
const enji: string = 'pa:5829300378438982793';

const testKey: string = '50e5ec8f93f81afa-18929e46118ddadf-d403a42f5e5c40c3';
const testId: string = 'XBEn/ssvUm7uCWb0eZK6OQ==';
const testM: string = 'pa:5829325394107964154';

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

export const sendMessage = async (message: object): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/send_message',
    body: message
  };

  return await sendRequest(payload);
};

export const setWebhook = async (webhookURL: string): Promise<any> => {
  const payload: RequestInterface = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/set_webhook',
    body: {
      url: webhookURL,
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
