import React, { useRef } from "react";
import { convertFromHTML } from "draft-js";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
// erxes
import Avatar from "../../../common/nameCard/Avatar";
import Attachment from "../../../common/Attachment";
import Tip from "../../../common/Tip";
import Icon from "../../../common/Icon";
import { IUser } from "../../../auth/types";
import {
  MessageItemWrapper,
  MessageWrapper,
  MessageReply,
  MessageBody,
  MessageOption,
  MessageContent,
  MessageAttachmentWrapper,
} from "../../styles";

dayjs.extend(calendar);

type Props = {
  message: any;
  setReply: (text: string) => void;
  currentUser: IUser;
};

const MessageItem = (props: Props) => {
  const { message, currentUser } = props;
  const actionRef = useRef<HTMLElement>(null);

  const isMe = currentUser._id === message.createdUser._id;
  const draftContent =
    message.relatedMessage && convertFromHTML(message.relatedMessage.content);

  const handleMouseEnter = () => {
    if (actionRef && actionRef.current) {
      const element = actionRef.current;

      if (element && element.style) {
        element.style.visibility = "visible";
      }
    }
  };

  const handleMouseLeave = () => {
    if (actionRef && actionRef.current) {
      const element = actionRef.current;

      if (element && element.style) {
        element.style.visibility = "hidden";
      }
    }
  };

  const renderAttachments = () => {
    return (message.attachments || []).map((attachment) => (
      <Attachment
        key={attachment._id}
        attachment={attachment || {}}
        simple={true}
      />
    ));
  };

  return (
    <MessageItemWrapper
      me={isMe}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        <MessageBody me={isMe} id="MessageBody">
          <Tip placement="top" text="Reply">
            <MessageOption id="test"
              onClick={() => props.setReply(message)}
              innerRef={actionRef}
            >
              <Icon icon="reply" color="secondary" />
            </MessageOption>
          </Tip>
          <Tip
            placement={isMe ? "left" : "right"}
            text={message.createdAt && dayjs(message.createdAt).calendar()}
          >
            <MessageContent
              dangerouslySetInnerHTML={{ __html: message.content || "" }}
              me={isMe}
            />
          </Tip>
        </MessageBody>
        <MessageAttachmentWrapper>
          {renderAttachments()}
        </MessageAttachmentWrapper>
      </MessageWrapper>
      {!isMe && <Avatar user={message.createdUser} size={36} />}
    </MessageItemWrapper>
  );
};

export default MessageItem;
