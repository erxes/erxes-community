import React, { useState } from "react";
// erxes
import Avatar from "../../../../modules/common/nameCard/Avatar";
import Icon from "../../../../modules/common/Icon";
import Button from "../../../../modules/common/Button";
import Tip from "../../../../modules/common/Tip";
import { IUser } from "../../../auth/types";
// local
import MessageList from "../../containers/chat/MessageList";
import Editor from "../../containers/chat/Editor";
import ReplyInfo from "./ReplyInfo";
import {
  ChatGroupAvatar,
  WidgetChatWindowWrapper,
  WidgetChatWindowHeader,
  MinimizedWidgetChatWindow,
  AvatarImg,
  MembersPopoverWrapper,
  ParticipantItemWrapper,
} from "../../styles";
import { OverlayTrigger, Popover } from "react-bootstrap";
import ParticipantList from "./participants/ParticipantList";
import GroupChatAction from "../../containers/chat/GroupChatAction";
import { readFile } from "../../../utils";

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [popoverContentType, setPopoverContentType] = useState("main");

  const users: any[] = chat.participantUsers || [];
  const user: any =
    users.length > 1
      ? users.filter((u) => u._id !== currentUser._id)[0]
      : users[0];

  const handleKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      props.handleActive(chat._id);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const popoverContent = () => {
    if (popoverContentType === "members") {
      return (
        <Popover id="groupMembers-popover">
          <MembersPopoverWrapper>
            <Button
              btnStyle="link"
              icon="arrow-left"
              onClick={() => setPopoverContentType("main")}
            >
              Back
            </Button>
            <ParticipantList type="widget" chat={chat} />
          </MembersPopoverWrapper>
        </Popover>
      );
    }
    if (popoverContentType === "main") {
      return (
        <Popover id="groupMembers-popover">
          <GroupChatAction chat={chat} />
          <ParticipantItemWrapper>
            <a onClick={() => setPopoverContentType("members")}>
              <Icon icon="users" color="black" size={13} />
              See group members
            </a>
          </ParticipantItemWrapper>
        </Popover>
      );
    }
    return null;
  };

  const showActiveChat = () => {
    if (isMinimized) {
      return (
        <MinimizedWidgetChatWindow onClick={() => handleMinimize()}>
          <WidgetChatWindowHeader>
            <div>
              {chat.type === "direct" ? (
                <Avatar user={user} size={23} />
              ) : (
                <ChatGroupAvatar>
                  {chat.featuredImage.length > 0 ? (
                    <AvatarImg
                      alt={"author"}
                      size={23}
                      src={readFile(chat && chat.featuredImage[0].url, 60)}
                    />
                  ) : (
                    <>
                      <Avatar user={users[0]} size={18} />
                      <Avatar user={users[1]} size={18} />
                    </>
                  )}
                </ChatGroupAvatar>
              )}
              <Tip
                text={chat.name || user.details?.fullName || user.email}
                placement="top"
              >
                <p className="name">
                  {chat.name || user.details?.fullName || user.email}
                </p>
              </Tip>
            </div>
            <div>
              <Icon icon="minus-1" size={20} onClick={() => handleMinimize()} />
              <Icon
                icon="times"
                size={24}
                onClick={() => props.handleActive(chat._id)}
              />
            </div>
          </WidgetChatWindowHeader>
        </MinimizedWidgetChatWindow>
      );
    }

    return (
      <WidgetChatWindowWrapper onKeyDown={handleKeyDown}>
        <WidgetChatWindowHeader>
          <div>
            {chat.type === "direct" ? (
              <Avatar user={user} size={32} />
            ) : (
              <ChatGroupAvatar>
                {chat.featuredImage.length > 0 ? (
                  <AvatarImg
                    alt={"author"}
                    size={32}
                    src={readFile(chat && chat.featuredImage[0].url, 60)}
                  />
                ) : (
                  <>
                    <Avatar user={users[0]} size={24} />
                    <Avatar user={users[1]} size={24} />{" "}
                  </>
                )}
              </ChatGroupAvatar>
            )}
            <p>
              <Tip
                text={chat.name || user?.details?.fullName || user?.email}
                placement="top"
              >
                <div className="name">
                  {chat.name || user?.details?.fullName || user?.email}
                </div>
              </Tip>

              {chat.type === "direct" && (
                <Tip text={user.details?.position} placement="top">
                  <div className="position">{user.details?.position}</div>
                </Tip>
              )}
            </p>
            {chat.type === "group" && (
              <OverlayTrigger
                trigger="click"
                rootClose={false}
                placement="bottom"
                overlay={popoverContent()}
                onExit={() => setPopoverContentType("main")}
              >
                <Icon icon="downarrow-2" size={14} />
              </OverlayTrigger>
            )}
          </div>
          <div>
            <Icon icon="minus-1" size={24} onClick={() => handleMinimize()} />
            <Icon
              icon="times"
              size={24}
              onClick={() => props.handleActive(chat._id)}
            />
          </div>
        </WidgetChatWindowHeader>
        <MessageList
          currentUser={currentUser}
          chatId={chat._id}
          setReply={setReply}
          chatType={chat.type}
        />
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

  return showActiveChat();
};

export default WidgetChatWindow;
