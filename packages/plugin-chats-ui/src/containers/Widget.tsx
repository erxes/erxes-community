import React from 'react';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import Component from '../components/Widget';
import { queries, subscriptions } from '../graphql';
import { IUser } from '@erxes/ui/src/auth/types';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';

type Props = {
  currentUser: IUser;
};

const WdigetListContainer = (props: Props) => {
  const { currentUser } = props;

  const { loading, error, data, refetch } = useQuery(
    gql(queries.getUnreadChatCount)
  );

  useSubscription(gql(subscriptions.chatUnreadCountChanged), {
    variables: { userId: currentUser._id },
    onSubscriptionData: () => {
      refetch();
    }
  });

  if (loading) {
    return <p>...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Component
      unreadCount={data.getUnreadChatCount || 0}
      currentUser={currentUser}
    />
  );
};

const WithCurrentUser = withCurrentUser(WdigetListContainer);

export default (props: Props) => <WithCurrentUser {...props} />;