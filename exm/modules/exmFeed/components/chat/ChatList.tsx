import { IUser } from "../../../auth/types";
import React from "react";
import { __ } from "../../../../utils";
import ChatItem from "../../containers/chat/ChatItem";
import ModalTrigger from "../../../common/ModalTrigger";
import Icon from "../../../common/Icon";
import CreateGroupChat from "../../containers/chat/CreateGroupChat";
import { IconButton, ChatListHeader } from "../../styles";
import Tip from "../../../common/Tip";

type Props = {
  users: IUser[];
  chats: any[];
  currentUser: IUser;
  handleActive?: (chatId: string) => void;
};

export default function ChatList({
  users,
  chats,
  currentUser,
  handleActive,
}: Props) {
  const contactedUsers = chats.map(
    (c) => c.type === "direct" && c.participantUsers[0]._id
  );

  return (
    <>
      <ChatListHeader>
        <label>{__("Your group")}</label>
        <ModalTrigger
          title="Create a group chat"
          trigger={
            <IconButton>
              <Tip placement="top" text="Create group chat">
                <Icon icon="users" size={15} />
              </Tip>
            </IconButton>
          }
          content={(props) => (
            <CreateGroupChat {...props} handleClickItem={handleActive} />
          )}
        />
      </ChatListHeader>
      {chats.map((c) => {
        if (c.type === "group") {
          return (
            <ChatItem
              chat={c}
              currentUser={currentUser}
              handleClickItem={() => handleActive(c._id)}
            />
          );
        }
        return null;
      })}
      <label>{__("Contacts")}</label>
      {chats.map((chat) => {
        if (chat.type === "direct") {
          return (
            <ChatItem
              currentUser={currentUser}
              chat={chat}
              handleClickItem={() => handleActive(chat._id)}
            />
          );
        }

        return null;
      })}
      {users.map((user) => {
        if (!contactedUsers.includes(user._id)) {
          return (
            <ChatItem
              key={user._id}
              currentUser={currentUser}
              notContactUser={user}
              hasOptions={true}
              handleClickItem={handleActive}
            />
          );
        }

        return null;
      })}
    </>
  );
}
