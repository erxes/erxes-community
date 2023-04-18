import { sendRequest } from '@erxes/api-utils/src';

const ApiKey1: string = '50dfa9d00f67df44-cbcbe4fcc2f83742-d80626370fd9edff';
const ApiKey2: string = '50e486c1f867e4cc-faa151fa47843647-3312be901c5f82f7';

const authHeader = {
  'X-Viber-Auth-Token': ApiKey2
};

export const setWebhook = async (webhookURL: string) => {
  const payload = {
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
        'conversation_started'
      ],
      send_name: true,
      send_photo: true
    }
  };

  return await sendRequest(payload);
};

export const removeWebhook = async () => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/set_webhook',
    body: { url: '' }
  };

  return await sendRequest(payload);
};

export const sendMessage = async () => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/send_message',
    body: {
      receiver: '01234567890A=',
      min_api_version: 1,
      sender: {
        name: 'John McClane',
        avatar: 'http://avatar.example.com'
      },
      tracking_data: 'tracking data',
      type: 'text',
      text: 'Hello world!'
    }
  };

  return await sendRequest(payload);
};

export const broadcastMessage = async () => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/broadcast_message',
    body: {
      broadcast_list: [
        'ABB102akPCRKFaqxWnafEIA==',
        'ABB102akPCRKFaqxWna111==',
        'ABB102akPCRKFaqxWnaf222=='
      ]
    }
  };

  return await sendRequest(payload);
};

export const getAccountInfo = async () => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_account_info',
    body: {}
  };

  return await sendRequest(payload);
};

export const getUserDetail = async (userId: string) => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_user_details',
    body: { id: userId }
  };

  return await sendRequest(payload);
};

export const getOnline = async () => {
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/get_online',
    body: {
      ids: ['01234567890=', '01234567891=', '01234567893=']
    }
  };

  return await sendRequest(payload);
};

export const subscribe = async (body: object) => {
  console.log('subscribe!');
  const payload = {
    method: 'POST',
    headers: authHeader,
    url: 'https://chatapi.viber.com/pa/subscribe',
    body: body
  };

  return await sendRequest(payload);
};
