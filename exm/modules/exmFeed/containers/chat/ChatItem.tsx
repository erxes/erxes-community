import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
// erxes
import Alert from "../../../utils/Alert";
import confirm from "../../../utils/confirmation/confirm";
// local
import Component from "../../components/chat/ChatItem";
import { queries, mutations } from "../../graphql";
import { IUser } from "../../../auth/types";

type Props = {
  chat?: any;
  isWidget?: boolean;
  hasOptions?: boolean;
  handleClickItem?: (chatId: string) => void;
  currentUser: IUser;
  handlePin: (chatId: string) => void;
  notContactUser?: IUser;
  isForward?: boolean;
  forwardChat?: (id?: string, type?: string) => void;
};

const ChatItemContainer = (props: Props) => {
  const { chat, handleClickItem } = props;
  const [removeMutation] = useMutation(gql(mutations.chatRemove));
  const [markAsReadMutation] = useMutation(gql(mutations.chatMarkAsRead));
  const [chatAddMutation] = useMutation(gql(mutations.chatAdd));

  const remove = () => {
    confirm()
      .then(() => {
        removeMutation({
          variables: { id: chat._id },
          refetchQueries: [{ query: gql(queries.chats) }],
        }).catch((error) => {
          Alert.error(error.message);
        });
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const markAsRead = () => {
    markAsReadMutation({
      variables: { id: chat._id },
      refetchQueries: [{ query: gql(queries.chats) }],
    }).catch((error) => {
      Alert.error(error.message);
    });
  };

  const createChat = (userIds: string[]) => {
    chatAddMutation({
      variables: { type: "direct", participantIds: userIds || [] },
    })
      .then(({ data }) => {
        if (handleClickItem) {
          handleClickItem(data.chatAdd._id);
        }
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  return (
    <Component
      {...props}
      remove={remove}
      markAsRead={markAsRead}
      forwardChat={props.forwardChat}
      createChats={createChat}
    />
  );
};

export default ChatItemContainer;
