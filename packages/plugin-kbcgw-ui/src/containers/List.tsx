import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { Alert, confirm, router, withProps } from '@erxes/ui/src/utils';
import List from '../components/List';
import {
  EditMutationResponse,
  RemoveMutationResponse,
  KbcgwQueryResponse,
  TypeQueryResponse
} from '../types';
import { mutations, queries } from '../graphql';
import React from 'react';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import Spinner from '@erxes/ui/src/components/Spinner';

type Props = {
  history: any;
  typeId: string;
};

type FinalProps = {
  listQuery: KbcgwQueryResponse;
  listKbcgwTypeQuery: TypeQueryResponse;
} & Props &
  RemoveMutationResponse &
  EditMutationResponse;

const ListContainer = (props: FinalProps) => {
  const {
    listQuery,
    listKbcgwTypeQuery,
    removeMutation,
    editMutation,
    history,
    typeId
  } = props;

  if (listQuery.loading) {
    return <Spinner />;
  }

  const types = listKbcgwTypeQuery.kbcgwTypes || [];

  const renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.edit : mutations.add}
        variables={values}
        callback={callback}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${passedName}`}
        refetchQueries={['listQuery']}
      />
    );
  };

  const remove = kbcgw => {
    confirm('You are about to delete the item. Are you sure? ')
      .then(() => {
        removeMutation({ variables: { _id: kbcgw._id } })
          .then(() => {
            Alert.success('Successfully deleted an item');
          })
          .catch(e => Alert.error(e.message));
      })
      .catch(e => Alert.error(e.message));
  };

  const edit = kbcgw => {
    editMutation({
      variables: {
        _id: kbcgw._id,
        name: kbcgw.name,
        checked: kbcgw.checked,
        expiryDate: kbcgw.expiryDate,
        type: kbcgw.type
      }
    })
      .then(() => {
        Alert.success('Successfully updated an item');
        listQuery.refetch();
      })
      .catch(e => Alert.error(e.message));
  };

  const updatedProps = {
    ...props,
    kbcgws: listQuery.kbcgws || [],
    types: listKbcgwTypeQuery.kbcgwTypes || [],
    typeId,
    loading: listQuery.loading,
    remove,
    edit,
    renderButton
  };
  return <List {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(gql(queries.listKbcgwTypes), {
      name: 'listKbcgwTypeQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),

    graphql<Props, KbcgwQueryResponse, { typeId: string }>(gql(queries.list), {
      name: 'listQuery',
      options: ({ typeId }) => ({
        variables: { typeId: typeId || '' },
        fetchPolicy: 'network-only'
      })
    }),
    graphql(gql(queries.totalCount), {
      name: 'totalCountQuery'
    }),

    graphql(gql(mutations.remove), {
      name: 'removeMutation',
      options: () => ({
        refetchQueries: ['listQuery']
      })
    }),

    graphql(gql(mutations.edit), {
      name: 'editMutation'
    })
  )(ListContainer)
);
