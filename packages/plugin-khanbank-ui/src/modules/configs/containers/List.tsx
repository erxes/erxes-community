import { router } from '@erxes/ui/src';
import { Alert, confirm } from '@erxes/ui/src/utils';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import { ConfigsListQueryResponse } from '../types';

type Props = {
  refetch: () => void;
  queryParams: any;
};

export default function CityContainer(props: Props) {
  const { data, loading, refetch } = useQuery<ConfigsListQueryResponse>(
    gql(queries.listQuery),
    {
      variables: {
        ...router.generatePaginationParams(props.queryParams || {})
      },
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation] = useMutation(gql(mutations.removeMutation));

  const remove = (cityId: string) => {
    const message = 'Are you sure want to remove this config ?';

    confirm(message).then(() => {
      removeMutation({
        variables: { _id: cityId }
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

  return <List {...extendedProps} />;
}
