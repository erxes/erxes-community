import { IUser } from "../../../auth/types";
import React, { useState } from "react";
import { __ } from "../../../../utils";
import ChatItem from "../../containers/chat/ChatItem";
import ModalTrigger from "../../../common/ModalTrigger";
import Icon from "../../../common/Icon";
import FormControl from "../../../common/form/Control";
import CreateGroupChat from "../../containers/chat/CreateGroupChat";
import { IconButton, ChatListHeader, SearchInput, NoEvent } from "../../styles";
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
    (c) => c.type === "direct" && c.participantUsers[0]?._id
  );

  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredGroupChat, setFilteredGroupChat] = useState([]);

  const search = (e) => {
    const inputValue = e.target.value;

    setSearchValue(inputValue);
    setFilteredUsers(
      users.filter((item) => {
        return (
          item.details?.fullName
            ?.toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          item.username?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.email?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.details?.position
            ?.toLowerCase()
            .includes(inputValue.toLowerCase())
        );
      })
    );
    setFilteredGroupChat(
      chats.filter((chat) => {
        if (chat.type === "group") {
          return chat.name.toLowerCase().includes(inputValue.toLowerCase());
        }
      })
    );
  };

  const renderUsers = () => {
    if (searchValue !== "") {
      if (filteredUsers.length > 0 || filteredGroupChat.length > 0) {
        return (
          <>
            {filteredGroupChat.map((groupChat) => (
              <ChatItem
                currentUser={currentUser}
                chat={groupChat}
                handleClickItem={() => handleActive(groupChat._id)}
                key={groupChat.name}
              />
            ))}
            {filteredUsers.map((user) => {
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

              return chats.map((chat) => {
                if (chat.participantUsers[0]._id === user._id) {
                  return (
                    <ChatItem
                      currentUser={currentUser}
                      chat={chat}
                      handleClickItem={() => handleActive(chat._id)}
                    />
                  );
                }

                return null;
              });
            })}
          </>
        );
      }

      return (
        <NoEvent>
          <Icon icon="ban" size={33} />
          No matching members
        </NoEvent>
      );
    }

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
  };

  return (
    <>
      <SearchInput>
        <Icon icon="search-1" size={18} />
        <FormControl
          placeholder={__("Search")}
          name="searchValue"
          onChange={search}
          value={searchValue}
          autoFocus={false}
        />
      </SearchInput>
      {renderUsers()}
    </>
  );
}
