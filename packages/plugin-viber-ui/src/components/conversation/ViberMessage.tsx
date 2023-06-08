import React from 'react';
import SimpleMessage from '@erxes/ui-inbox/src/inbox/components/conversationDetail/workarea/conversation/messages/SimpleMessage';
import { IConversation, IMessage } from '@erxes/ui-inbox/src/inbox/types';

type Props = {
  detailQuery?: any;
  conversation: IConversation;
  conversationMessages: IMessage[];
};

class ViberMessage extends React.Component<Props, {}> {
  render() {
    const { conversation, conversationMessages, detailQuery } = this.props;

    if (!conversation) {
      return null;
    }

    const messages = conversationMessages || [];

    return messages.map((message, index) => {
      return (
        <SimpleMessage
          key={message._id}
          message={message}
          isStaff={!message.customerId}
        />
      );
    });
  }
}

export default ViberMessage;
