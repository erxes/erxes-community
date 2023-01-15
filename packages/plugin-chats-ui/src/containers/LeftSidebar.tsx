import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useSubscription } from 'react-apollo';
import queryString from 'query-string';
import gql from 'graphql-tag';
// erxes
import Alert from '@erxes/ui/src/utils/Alert';
import confirm from '@erxes/ui/src/utils/confirmation/confirm';
import * as router from '@erxes/ui/src/utils/router';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@erxes/ui/src/auth/types';
// local
import LeftSidebarComponent from '../components/LeftSidebar';
import { queries, mutations, subscriptions } from '../graphql';

type Props = {
  currentUser: IUser;
};

const LeftSidebarContainer = (props: Props) => {
  const { currentUser } = props;
  const history = useHistory();
  const { search } = useLocation();
  const { id } = queryString.parse(search);

  const [removeMutation] = useMutation(gql(mutations.removeChat));
  const [markAsReadMutation] = useMutation(gql(mutations.markAsReadChat));
  const chats = useQuery(gql(queries.chats));

  useSubscription(gql(subscriptions.chatInserted), {
    variables: { userId: currentUser._id },
    onSubscriptionData: () => {
      chats.refetch();
    }
  });

  const removeChat = (selectedId: string) => {
    confirm()
      .then(() => {
        removeMutation({
          variables: { id: selectedId },
          refetchQueries: [{ query: gql(queries.chats) }]
        })
          .then(() => {
            if (selectedId === id) {
              router.removeParams(history, 'id', 'userId', 'userIds');
            }
          })
          .catch(error => {
            Alert.error(error.message);
          });
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const markChatAsRead = (selectedId: string) => {
    markAsReadMutation({
      variables: { id: selectedId }
    })
      .then(() => {
        chats.refetch();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  if (chats.loading) {
    return <p>...</p>;
  }

  if (chats.error) {
    return <p>{chats.error.message}</p>;
  }

  return (
    <LeftSidebarComponent
      chats={chats.data.chats.list}
      id={id}
      removeChat={removeChat}
      markChatAsRead={markChatAsRead}
    />
  );
};

export default withCurrentUser(LeftSidebarContainer);
