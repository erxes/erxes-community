import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import {
  OperationCategoriesQueryResponse,
  RemoveOperationCategoryMutationResponse
} from '../../common/types';
import List from '../components/List';
import { mutations } from '../graphql';
import queries from '../graphql/queries';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

type FinalProps = {
  categories: OperationCategoriesQueryResponse;
} & Props &
  RemoveOperationCategoryMutationResponse;

class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { categories, remove } = this.props;

    const removeCategory = variables => {
      remove(variables);
    };

    const updatedProps = {
      ...this.props,
      list: categories.auditOperationsCategories || [],
      totalCount: categories.auditOperationsCategoriesTotalCount || 0,
      loading: categories.loading || false,
      remove: removeCategory
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.operationCategories), {
      name: 'categories',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props>(gql(mutations.removeCategory), {
      name: 'remove'
    })
  )(ListContainer)
);
