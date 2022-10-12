import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { Alert, Bulk, Spinner } from '@erxes/ui/src';
import List from '../components/List';
import { IRouterProps } from '@erxes/ui/src/types';
import { mutations, queries } from '../graphql';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { MovementQueryResponse, MovementsTotalCountQueryResponse } from '../../common/types';
import { generateParams } from '../../common/utils';

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

    const remove = () => {
      this.props.movementRemove().then(() => {
        movementsQuery.refetch();
        movementsTotalCountQuery.refetch();
        Alert.success('Removed movement');
      });
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
      name: 'movementsTotalCountQuery'
    }),
    graphql<Props>(gql(mutations.movementRemove), {
      name: 'movementRemove'
    })
  )(ListContainer)
);
