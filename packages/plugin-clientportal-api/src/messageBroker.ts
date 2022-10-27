import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';

import { serviceDiscovery } from './configs';
import { generateModels, IModels } from './connectionResolver';

let client;

interface ISendNotification {
  createdUser;
  receivers: string[];
  title: string;
  content: string;
  notifType: string;
  link: string;
  clientPortalId: string;
  isMobile?: boolean;
}

const sendNotification = async (
  models: IModels,
  subdomain: string,
  doc: ISendNotification
) => {
  const {
    createdUser,
    receivers,
    title,
    content,
    notifType,
    clientPortalId,
    isMobile
  } = doc;

  let link = doc.link;

  // remove duplicated ids
  const receiverIds = [...Array.from(new Set(receivers))];

  // collecting emails
  const recipients = await models.ClientPortalUsers.find({
    _id: { $in: receiverIds },
    clientPortalId
  });

  // collect recipient emails
  const toEmails: string[] = [];

  for (const recipient of recipients) {
    if (recipient.notificationSettings.receiveByEmail && recipient.email) {
      toEmails.push(recipient.email);
    }
  }

  // loop through receiver ids
  for (const receiverId of receiverIds) {
    try {
      // send web and mobile notification
      const notification = await models.ClientPortalNotifications.createNotification(
        {
          title,
          content,
          link,
          receiver: receiverId,
          notifType,
          clientPortalId
        },
        createdUser._id
      );

      console.log('notification', notification);

      // graphqlPubsub.publish('notificationInserted', {
      //   notificationInserted: {
      //     _id: notification._id,
      //     userId: receiverId,
      //     title: notification.title,
      //     content: notification.content,
      //   },
      // });
    } catch (e) {
      // Any other error is serious
      if (e.message !== 'Configuration does not exist') {
        throw e;
      }
    }
  } // end receiverIds loop

  // const DOMAIN = getEnv({ name: 'DOMAIN' });

  // link = `${DOMAIN}${link}`;

  // // for controlling email template data filling
  // const modifier = (data: any, email: string) => {
  //   const user = recipients.find((item) => item.email === email);

  //   if (user) {
  //     data.uid = user._id;
  //   }
  // };

  // sendCoreMessage({
  //   subdomain,
  //   action: 'sendEmail',
  //   data: {
  //     toEmails,
  //     title: 'Notification',
  //     template: {
  //       name: 'notification',
  //       data: {
  //         notification: { ...doc, link },
  //         action,
  //         userName: getUserDetail(createdUser),
  //       },
  //     },
  //     modifier,
  //   },
  // });

  if (isMobile) {
    const deviceTokens = [
      ...Array.from(new Set(recipients.map(r => r.deviceTokens)))
    ];

    sendCoreMessage({
      subdomain: subdomain,
      action: 'sendMobileNotification',
      data: {
        title: 'Үнийн санал илгээсэн танд баярлалаа.',
        body: 'Таны үнийн саналыг амжилттай хүлээн авлаа!',
        deviceTokens
      }
    });
  }
};

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue, consumeQueue } = client;

  consumeRPCQueue(
    'clientportal:clientPortals.findOne',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.ClientPortals.findOne(data),
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'clientportal:clientPortalUsers.findOne',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.ClientPortalUsers.findOne(data),
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'clientportal:clientPortalUsers.find',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.ClientPortalUsers.find(data).lean(),
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'clientportal:clientPortals.count',
    async ({ subdomain, data: { selector } }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.ClientPortals.find(selector).count(),
        status: 'success'
      };
    }
  );

  consumeQueue('clientportal:sendNotification', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    await sendNotification(models, subdomain, data);
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs) => {
  return sendMessage({
    serviceDiscovery,
    client,
    serviceName: 'core',
    ...args
  });
};

export const sendContactsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendCardsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'cards',
    ...args
  });
};

export const sendKbMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'knowledgebase',
    ...args
  });
};

export default function() {
  return client;
}
