import { IContext } from '../../connectionResolver';
import * as twitterUtils from '../../api';
import { downloadAttachment } from '../../utils';
import receiveDms from '../../receiveDms';

const twitterMutations = {
  async twitterWebhookPost(_root, { data }) {
    try {
      await receiveDms(data);
    } catch (e) {
      return new Error(e);
    }
  },
  async twitterCreateIntegration(
    _root,
    { accountId, integrationId, data, kind },
    { models }: IContext
  ) {
    const prevEntry = await models.Integrations.findOne({
      accountId
    });

    if (prevEntry) {
      return new Error(`You already have integration on this account`);
    }

    const account = await models.Accounts.getAccount({ _id: accountId });

    await models.Integrations.create({
      kind,
      accountId,
      erxesApiId: integrationId,
      twitterAccountId: data.twitterAccountId
    });

    try {
      await twitterUtils.subscribeToWebhook(account);
    } catch (e) {
      // deleting previous subscription
      if (e.message.includes('already exists')) {
        await twitterUtils.removeFromWebhook(account);

        // adding new subscription
        await twitterUtils.subscribeToWebhook(account);
      }
    }
  },
  async twitterReply(
    _root,
    { attachments, conversationId, content, integrationId },
    { models }: IContext
  ) {
    if (attachments.length > 1) {
      return new Error('You can only attach one file');
    }

    const attachment = {
      media: {
        id: null
      },
      type: 'media'
    };

    for (const attach of attachments) {
      const base64 = await downloadAttachment(attach.url);
      attachment.media.id = attach.url;

      const response: any = await twitterUtils.upload(base64);
      attachment.media.id = JSON.parse(response).media_id_string;
    }

    const conversation = await models.Conversations.getConversation({
      erxesApiId: conversationId
    });

    const integration = await models.Integrations.findOne({
      erxesApiId: integrationId
    });

    const account: any = await models.Accounts.findOne({
      _id: integration?.accountId
    });

    const recipientId = conversation.senderId;

    const message = await twitterUtils.reply(
      recipientId,
      content,
      attachment,
      account
    );

    const { event } = message;
    const { id, created_timestamp, message_create } = event;
    const { message_data } = message_create;

    // save on integrations db
    await models.ConversationMessages.create({
      conversationId: conversation._id,
      messageId: id,
      timestamp: created_timestamp,
      content: message_data.text
    });
  }
};

export default { twitterMutations };
