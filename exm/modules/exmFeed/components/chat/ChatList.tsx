import { IUser } from "../../../auth/types";
import React from "react";
import { __ } from "../../../../utils";
import ChatItem from "../../containers/chat/ChatItem";
import ModalTrigger from "../../../common/ModalTrigger";
import Icon from "../../../common/Icon";
import CreateGroupChat from "../../containers/chat/CreateGroupChat";
import { IconButton } from "../../styles";

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
      <label>
        {__("Your group")}
        <ModalTrigger
          title="Create a group chat"
          trigger={
            <IconButton>
              <Icon icon="users" size={15} />
            </IconButton>
          }
          content={(props) => <CreateGroupChat {...props} />}
        />
      </label>
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
