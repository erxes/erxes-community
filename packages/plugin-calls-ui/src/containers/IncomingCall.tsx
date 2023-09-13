import React from 'react';
import IncomingCall from '../components/IncomingCall';
import { queries, subscriptions } from '../graphql';
import { useQuery, gql } from '@apollo/client';
import { IUser } from '@erxes/ui/src/auth/types';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';

type Props = {
  currentUser: IUser;
};

const IncomingCallContainer = (props: Props) => {
  const { currentUser } = props;

  const { data, loading, error } = useQuery(
    gql(queries.callsIntegrationOperator),
    {
      fetchPolicy: 'network-only'
    }
  );

  console.log(data);
  // const { data } = useSubscription(gql(subscriptions.phoneCallReceived), {
  //   variables: {
  //     userId: currentUser ? currentUser._id : ''
  //   },
  //   skip: !currentUser
  // });

  // if (!data || !data.phoneCallReceived) {
  //   return null;
  // }

  // const callData = data && data.phoneCallReceived;

  return <IncomingCall />;
};

const WithCurrentUser = withCurrentUser(IncomingCallContainer);

export default (props: Props) => <WithCurrentUser {...props} />;
