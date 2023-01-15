import React, { useEffect } from 'react';
import { convertFromHTML } from 'draft-js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
// erxes
import Attachment from '@erxes/ui/src/components/Attachment';
import Spinner from '@erxes/ui/src/components/Spinner';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import Avatar from '@erxes/ui/src/components/nameCard/Avatar';
import { IUser } from '@erxes/ui/src/auth/types';
// local
import {
  MessageList,
  MessageItem,
  MessageWrapper,
  MessageBody,
  MessageContent,
  MessageReply,
  MessageOption
} from '../styles';

type Props = {
  messages: any[];
  latestMessages: any[];
  isAllMessages: boolean;
  currentUser: IUser;
  setReply: (text: string) => void;
  loadEarlierMessage: () => void;
};

const History = (props: Props) => {
  dayjs.extend(relativeTime);
  dayjs.extend(calendar);
  const { messages, latestMessages, isAllMessages, currentUser } = props;

  useEffect(() => {
    let element: HTMLElement | null = document.getElementById('message-list');

    if (element) {
      element.scrollTop = 0;
    }
  }, [latestMessages]);

  const handleMouseOver = (id: string) => {
    let element: HTMLElement | null = document.getElementById('action-' + id);

    if (element && element.style) {
      element.style.visibility = 'visible';
    }
  };

  const handleMouseLeave = (id: string) => {
    let element: HTMLElement | null = document.getElementById('action-' + id);

    if (element && element.style) {
      element.style.visibility = 'hidden';
    }
  };

  const handleScroll = () => {
    const element: HTMLElement | null = document.getElementById('message-list');

    if (
      element &&
      element.scrollTop === element.clientHeight - element.scrollHeight
    ) {
      props.loadEarlierMessage();
    }
  };

  const renderRow = (message: any) => {
    const isMe = currentUser._id === message.createdUser._id;
    const draftContent =
      message.relatedMessage && convertFromHTML(message.relatedMessage.content);

    return (
      <MessageItem
        key={message._id}
        me={isMe}
        onMouseOver={() => handleMouseOver(message._id)}
        onMouseLeave={() => handleMouseLeave(message._id)}
      >
        <div style={{ flex: 1 }} />
        <MessageWrapper me={isMe}>
          {draftContent && (
            <MessageReply>
              <b>
                {message.relatedMessage.createdUser &&
                  (message.relatedMessage.createdUser.details.fullName ||
                    message.relatedMessage.createdUser.email)}
                :&nbsp;
              </b>
              <p>{draftContent.contentBlocks[0].text}</p>
            </MessageReply>
          )}
          <MessageBody me={isMe}>
            {/* {attachment && <Attachment attachment={attachment} />} */}
            <Tip placement="top" text="Reply">
              <MessageOption
                onClick={() => props.setReply(message)}
                id={`action-${message._id}`}
              >
                <Icon icon="reply" color="secondary" />
              </MessageOption>
            </Tip>
            <Tip
              placement={isMe ? 'left' : 'right'}
              text={message.createdAt && dayjs(message.createdAt).calendar()}
            >
              <>
                <MessageContent
                  dangerouslySetInnerHTML={{ __html: message.content || '' }}
                  me={isMe}
                />
              </>
            </Tip>
          </MessageBody>
        </MessageWrapper>
        <Avatar user={isMe ? currentUser : message.createdUser} size={36} />
      </MessageItem>
    );
  };

  return (
    <MessageList id="message-list" onScroll={handleScroll}>
      {latestMessages.map(message => renderRow(message))}
      {messages.map(message => renderRow(message))}
      {!isAllMessages ? (
        <MessageItem me={true}>
          <Spinner />
        </MessageItem>
      ) : (
        ''
      )}
    </MessageList>
  );
};

export default History;
