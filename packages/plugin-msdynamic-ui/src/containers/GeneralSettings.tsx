import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { Alert, withProps } from '@erxes/ui/src/utils';
import List from '../components/GeneralSettings';
import {
  EditMutationResponse,
  AddMutationResponse,
  MsdynamicQueryResponse,
  IDynamic
} from '../types';
import { mutations, queries } from '../graphql';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';

type Props = {
  history: any;
};

type FinalProps = {
  listQuery: MsdynamicQueryResponse;
} & Props &
  AddMutationResponse &
  EditMutationResponse;

const GeneralSettingsContainer = (props: FinalProps) => {
  const { listQuery, addMutation, editMutation } = props;

  if (listQuery.loading) {
    return <Spinner />;
  }

  const configsSave = (doc: IDynamic) => {
    if (!doc._id) {
      addMutation({
        variables: doc
      })
        .then(() => {
          Alert.success('Successfully added an configs');
          listQuery.refetch();
        })
        .catch(e => Alert.error(e.message));
    }

    if (doc._id) {
      editMutation({
        variables: doc
      })
        .then(() => {
          Alert.success('Successfully updated an configs');
          listQuery.refetch();
        })
        .catch(e => Alert.error(e.message));
    }
  };

  const updatedProps = {
    ...props,
    msdynamics: listQuery?.msdynamicConfigs[0] || {},
    configsSave
  };
  return <List {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, MsdynamicQueryResponse, {}>(gql(queries.dynamicConfigs), {
      name: 'listQuery'
    }),

    graphql(gql(mutations.addConfigs), {
      name: 'addMutation',
      options: () => ({
        refetchQueries: ['msdynamicConfigs']
      })
    }),
    graphql(gql(mutations.editConfigs), {
      name: 'editMutation',
      options: () => ({
        refetchQueries: ['msdynamicConfigs']
      })
    })
  )(GeneralSettingsContainer)
);
