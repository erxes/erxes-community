import React from 'react';
import SimpleMessage from '@erxes/ui-inbox/src/inbox/components/conversationDetail/workarea/conversation/messages/SimpleMessage';
import { IConversation, IMessage } from '@erxes/ui-inbox/src/inbox/types';
import { ViberChatPanel } from '../../styles';
import WriteMessage from './WriteMessage';

type Props = {
  conversation: IConversation;
  conversationMessages: IMessage[];
};

class ViberMessage extends React.Component<Props, {}> {
  render() {
    const { conversation, conversationMessages } = this.props;

    if (!conversation) {
      return null;
    }

    const messages = conversationMessages || [];

    console.log('messages', messages);

    const Chat = messages.map((message, key) => (
      <ViberChatPanel key={key}>
        <SimpleMessage
          key={message._id}
          message={message}
          isStaff={!message.customerId}
        />
      </ViberChatPanel>
    ));

    return (
      <>
        {/* <ActionBar currentConversation={conversation} /> */}

        <ViberChatPanel>{Chat}</ViberChatPanel>

        <WriteMessage />
      </>
    );
  }
}

export default ViberMessage;
