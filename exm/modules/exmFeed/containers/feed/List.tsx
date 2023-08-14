import { mutations, queries } from '../../graphql';
import { useMutation, useQuery } from '@apollo/client';

import Alert from '../../../utils/Alert';
import List from '../../components/feed/List';
import WelcomeList from '../../components/feed/WelcomeList';
import React from 'react';
import Spinner from '../../../common/Spinner';
import { confirm } from '../../../utils';
import gql from 'graphql-tag';

import { useRouter } from 'next/router';

type Props = {
  queryParams: any;
  contentType: string;
};

export default function ListContainer(props: Props) {
  const { contentType } = props;
  const router = useRouter();

  const limit =
    router && router.query?.limit
      ? parseInt(String(router.query?.limit), 10)
      : 20;

  const feedResponse = useQuery(gql(queries.feed), {
    variables: {
      limit,
      contentTypes: [contentType || 'post']
    }
  });

  const [deleteMutation] = useMutation(gql(mutations.deleteFeed));
  const [pinMutation] = useMutation(gql(mutations.pinFeed));

  if (feedResponse.loading) {
    return <Spinner objective={true} />;
  }

  const pinItem = (_id: string) => {
    pinMutation({ variables: { _id } })
      .then(() => {
        Alert.success('Success!');

        feedResponse.refetch();
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const deleteItem = (_id: string) => {
    confirm().then(() => {
      deleteMutation({ variables: { _id } })
        .then(() => {
          Alert.success('You successfully deleted.');

          feedResponse.refetch();
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const { list, totalCount } = feedResponse.data?.exmFeed || {};

  if (contentType === 'welcome') {
    return <WelcomeList list={list} totalCount={totalCount} limit={limit} />;
  }

  return (
    <List
      deleteItem={deleteItem}
      pinItem={pinItem}
      list={list}
      totalCount={totalCount}
      limit={limit}
    />
  );
}
