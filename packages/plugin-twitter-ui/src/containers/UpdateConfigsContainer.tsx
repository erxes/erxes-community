import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import React from 'react';

import { Alert, withProps } from '@erxes/ui/src/utils';
import Spinner from '@erxes/ui/src/components/Spinner';
import UpdateConfigs from '../components/UpdateConfigs';
import { mutations, queries } from '../graphql';
import { IConfigsMap } from '@erxes/ui-settings/src/general/types';

type Props = {
  history: any;
};

type FinalProps = {
  getConfigsQuery: any;
  updateConfigsMutation: (configsMap: IConfigsMap) => Promise<void>;
} & Props;

const ConfigsContainer = (props: FinalProps) => {
  const { getConfigsQuery, updateConfigsMutation } = props;

  if (getConfigsQuery.loading) {
    return <Spinner />;
  }

  const configs = getConfigsQuery.twitterGetConfigs;
  const configsMap = {};

  for (const config of configs) {
    configsMap[config.code] = config.value;
  }

  const updateConfigs = (value: IConfigsMap) => {
    updateConfigsMutation({ variables: { configsMap: value } })
      .then(() => {
        Alert.success('Successfully updated configs');
        getConfigsQuery.refetch();
      })
      .catch(e => Alert.error(e.message));
  };

  const updatedProps = {
    loading: getConfigsQuery.loading,
    updateConfigs,
    configsMap
  };

  return <UpdateConfigs {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(gql(queries.twitterGetConfigs), {
      name: 'getConfigsQuery',
      options: () => ({
        fetchPolicy: 'network-only',
        variables: { kind: 'twitter' }
      })
    }),

    graphql(gql(mutations.twitterUpdateConfigs), {
      name: 'updateConfigsMutation'
    })
  )(ConfigsContainer)
);
