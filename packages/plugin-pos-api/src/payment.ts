import { generateModels } from './connectionResolver';
import * as moment from 'moment';
import { sendPosclientMessage } from './messageBroker';

export default {
  callback: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    console.log('data', data);

    const { contentTypeId, contentType, status, amount } = data;

    if (data.contentType !== 'pos:orders') {
      return;
    }

    const extra = data.data;
    const posToken = extra.posToken;
    const pos = await models.Pos.getPos({ token: posToken });

    sendPosclientMessage({
      subdomain,
      action: 'paymentCallbackClient',
      data: {},
      pos,
      isRPC: false
    });
  }
};
