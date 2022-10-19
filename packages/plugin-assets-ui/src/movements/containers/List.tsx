import { Alert, Bulk, confirm, Spinner } from '@erxes/ui/src';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { MovementQueryResponse, MovementsTotalCountQueryResponse } from '../../common/types';
import { generateParams } from '../../common/utils';
import List from '../components/List';
import { mutations, queries } from '../graphql';

type Props = { queryParams: any; history: string };
type FinalProps = {
  movementsQuery: MovementQueryResponse;
  movementsTotalCountQuery: MovementsTotalCountQueryResponse;
  movementRemove: any;
} & IRouterProps &
  Props;

class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    const { movementsQuery, movementsTotalCountQuery, history } = this.props;

    if (movementsQuery.loading) {
      return <Spinner />;
    }

    const remove = (ids: string[]) => {
      confirm()
        .then(() => {
          this.props.movementRemove({ variables: { ids } }).then(() => {
            movementsQuery.refetch();
            movementsTotalCountQuery.refetch();
            Alert.success('Removed movement');
          });
        })
        .catch(error => Alert.error(error.message));
    };

    const updateProps = {
      ...this.props,
      movements: movementsQuery.assetMovements,
      totalCount: movementsTotalCountQuery.assetMovementTotalCount,
      loading: movementsQuery.loading,
      refetch: movementsQuery.refetch,
      refetchTotalCount: movementsTotalCountQuery.refetch,
      history,
      remove
    };

    return <List {...updateProps} />;
  }

  render() {
    return <Bulk content={this.renderList} />;
  }
}

export default withProps(
  compose(
    graphql<Props>(gql(queries.movements), {
      name: 'movementsQuery',
      options: ({ queryParams }) => ({
        variables: generateParams({ queryParams })
      })
    }),
    graphql<Props>(gql(queries.movementsTotalCount), {
      name: 'movementsTotalCountQuery',
      options: ({ queryParams }) => ({
        variables: generateParams({ queryParams })
      })
    }),
    graphql<Props>(gql(mutations.movementRemove), {
      name: 'movementRemove'
    })
  )(ListContainer)
);
