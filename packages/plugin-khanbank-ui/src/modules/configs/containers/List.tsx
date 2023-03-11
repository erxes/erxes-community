import { router } from '@erxes/ui/src';
import { Alert, confirm } from '@erxes/ui/src/utils';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import List from '../components/List';
import SidebarList from '../../corporateGateway/components/ConfigsList';
import { mutations, queries } from '../graphql';
import { ConfigsListQueryResponse } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {
  refetch?: () => void;
  history?: any;
  queryParams: any;
} & IRouterProps;

export default function ListContainer(props: Props) {
  const isSettings = props.history.location.pathname === '/settings/khanbank';

  const variables: any = {
    ...router.generatePaginationParams(props.queryParams || {})
  };

  const { data, loading, refetch } = useQuery<ConfigsListQueryResponse>(
    gql(queries.listQuery),
    {
      variables: isSettings ? variables : {},
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation] = useMutation(gql(mutations.removeMutation));

  const remove = (_id: string) => {
    const message = 'Are you sure want to remove this config ?';

    confirm(message).then(() => {
      removeMutation({
        variables: { _id }
      })
        .then(() => {
          refetch();

          Alert.success('You successfully deleted a config.');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  const configs = (data && data.khanbankConfigsList.list) || [];

  const totalCount = (data && data.khanbankConfigsList.totalCount) || 0;

  const extendedProps = {
    ...props,
    loading,
    configs,
    totalCount,
    refetch,
    remove
  };

  if (!isSettings) {
    return <SidebarList {...extendedProps} />;
  }

  return <List {...extendedProps} />;
}
