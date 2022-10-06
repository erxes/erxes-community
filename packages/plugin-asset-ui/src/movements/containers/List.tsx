import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { Bulk, Spinner } from '@erxes/ui/src';
import List from '../components/List';
import { IRouterProps } from '@erxes/ui/src/types';
import { queries } from '../graphql';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { MovementQueryResponse } from '../../common/types';

type Props = {};
type FinalProps = { movementsQuery: MovementQueryResponse } & IRouterProps & Props;

class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    const { movementsQuery } = this.props;

    if (movementsQuery.loading) {
      return <Spinner />;
    }

    const updateProps = {
      ...this.props,
      movements: movementsQuery.assetMovements,
      loading: movementsQuery.loading,
      refetch: movementsQuery.refetch
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
      name: 'movementsQuery'
    })
  )(ListContainer)
);
