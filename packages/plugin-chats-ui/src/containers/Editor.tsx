import React from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
// erxes
import { Alert } from '@erxes/ui/src/utils';
// local
import EditorComponent from '../components/Editor';
import { mutations, queries } from '../graphql';

type Props = {
  chatId: string;
  reply?: any;
  setReply: (message: any) => void;
};

const EditorContainer = (props: Props) => {
  const { chatId, reply } = props;
  const [addMutation] = useMutation(gql(mutations.addChatMessage));

  const sendMessage = (content: string) => {
    if (!content) {
      return;
    }

    const relatedId = (reply && reply._id) || null;

    addMutation({
      variables: { content, chatId, relatedId },
      refetchQueries: [{ query: gql(queries.chats) }]
    }).catch(error => {
      Alert.error(error.message);
    });
  };

  return <EditorComponent {...props} sendMessage={sendMessage} />;
};

export default EditorContainer;
