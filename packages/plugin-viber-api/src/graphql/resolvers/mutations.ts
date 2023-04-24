import { ViberSentMessage, Accounts } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';
import { sendMessage } from '../../viber';

const viberMutations = {
  //viber create
  async viberCreate(_root, create: any, _context: IContext) {
    console.log(create);
    return create;
  },

  //viber bot send message to user
  async viberSendMessage(_root, { message }: any, _context: IContext) {
    const createMessage = {
      ...message,
      userId: _context.user._id
    };

    ViberSentMessage.create(createMessage);

    const payload = {
      receiver: message.receiverId,
      min_api_version: 1,
      sender: {
        name: 'John McClane'
      },
      tracking_data: 'tracking data',
      type: 'text',
      text: message.messageText
    };

    sendMessage(payload);

    return message;
  }
};

export default viberMutations;
