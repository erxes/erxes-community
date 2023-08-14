import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
// erxes
import Avatar from "../../../common/nameCard/Avatar";
import Icon from "../../../common/Icon";
import { IUser } from "../../../auth/types";
// local
import {
  ChatItemWrapper,
  ChatGroupAvatar,
  ChatWrapper,
  ChatActions,
  ChatActionItem,
  ContextMenuList,
  ContextMenuItem,
} from "../../styles";

type Props = {
  chat?: any;
  isWidget?: boolean;
  hasOptions?: boolean;
  handleClickItem?: (chatId: string) => void;
  createChat?: (userIds: string[]) => void;
  remove?: () => void;
  markAsRead?: () => void;
  notContactUser?: IUser;
  currentUser: IUser;
};

const ChatItem = (props: Props) => {
  const { chat, notContactUser, currentUser, createChat } = props;

  const users: any[] = chat?.participantUsers || [];
  const user: any =
    users.length > 1
      ? users.filter((u) => u._id !== currentUser._id)[0]
      : users[0];

  const handleClick = () => {
    if(chat) {
      props.handleClickItem(chat._id);
    }
    if(notContactUser){
      createChat([notContactUser._id, currentUser._id]);
    }
  };

  const popoverContextMenu = (
    <Popover id="contextmenu-popover">
      <ContextMenuList>
        <ContextMenuItem onClick={() => props.markAsRead()}>
          {chat && chat.isSeen ? "Mark as unread" : "Mark as read"}
        </ContextMenuItem>
        <ContextMenuItem color="red" onClick={() => props.remove()}>
          Delete Chat
        </ContextMenuItem>
      </ContextMenuList>
    </Popover>
  );

  return (
    <ChatItemWrapper
      id="ChatItemWrapper"
      isWidget={true}
    >
      {chat &&
        (chat.type === "direct" ? (
          <Avatar user={user} size={36} />
        ) : (
          <ChatGroupAvatar id="ChatGroupAvatar">
            <Avatar user={users[0]} size={24} />
            <Avatar user={users[1]} size={24} />
          </ChatGroupAvatar>
        ))}

      {notContactUser && <Avatar user={notContactUser} size={36} />}

      <ChatWrapper
        isSeen={
          notContactUser ? true :
          chat?.lastMessage?.createdUser?._id === currentUser?._id
            ? true
            : chat?.isSeen
        }
        onClick={handleClick}
      >
        <p>
          {chat && chat.type === "direct"
            ? user?.details.fullName || user?.email
            : chat?.name}
          {(notContactUser && notContactUser.details.fullName) ||
            notContactUser?.email ||
            null}
        </p>
      </ChatWrapper>
      {chat && <ChatActions>
        <OverlayTrigger
          trigger="click"
          rootClose={false}
          placement="bottom-start"
          overlay={popoverContextMenu}
        >
          <ChatActionItem>
            <Icon icon="ellipsis-h" size={14} />
          </ChatActionItem>
        </OverlayTrigger>
      </ChatActions>}
    </ChatItemWrapper>
    );
};

export default ChatItem;
