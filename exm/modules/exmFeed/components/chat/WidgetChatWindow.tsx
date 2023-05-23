import React, { useState } from 'react';
// erxes
import Avatar from '../../../../modules/common/nameCard/Avatar';
import Icon from '../../../../modules/common/Icon';
import { IUser } from '../../../auth/types';
// local
import MessageList from '../../containers/chat/MessageList';
import Editor from '../../containers/chat/Editor';
import ReplyInfo from './ReplyInfo';
import {
  ChatGroupAvatar,
  WidgetChatWindowWrapper,
  WidgetChatWindowHeader
} from '../../styles';

type Props = {
  chat: any;
  sendMessage: (
    content: string,
    _attachments?: any[],
    replyId?: string
  ) => void;
  handleActive: (chatId: string) => void;
  currentUser: IUser;
};

const WidgetChatWindow = (props: Props) => {
  const { chat, currentUser } = props;
  const [reply, setReply] = useState<any>(null);

  const users: any[] = chat.participantUsers || [];
  const user: any =
    users.length > 1
      ? users.filter(u => u._id !== currentUser._id)[0]
      : users[0];

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      event.preventDefault();
      props.handleActive(chat._id);
    }
  };

  return (
    <WidgetChatWindowWrapper onKeyDown={handleKeyDown}>
      <WidgetChatWindowHeader>
        <div>
          {chat.type === 'direct' ? (
            <Avatar user={user} size={36} />
          ) : (
            <ChatGroupAvatar>
              <Avatar user={users[0]} size={24} />
              <Avatar user={users[1]} size={24} />
            </ChatGroupAvatar>
          )}
          <p>
            {chat.name || user.details?.fullName || user.email}
            <br />
            {chat.type === 'direct' && user.details?.position}
          </p>
        </div>
        <Icon
          icon="times"
          size={24}
          onClick={() => props.handleActive(chat._id)}
        />
      </WidgetChatWindowHeader>
      <MessageList currentUser={currentUser} chatId={chat._id} setReply={setReply} />
      <ReplyInfo reply={reply} setReply={setReply} />
      <Editor
        chatId={chat._id}
        type="widget"
        setReply={setReply}
        reply={reply}
      />
    </WidgetChatWindowWrapper>
  );
};

export default WidgetChatWindow;