import * as compose from 'lodash.flowright';
import Alert from '@erxes/ui/src/utils/Alert';
import gql from 'graphql-tag';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { Bulk } from '@erxes/ui/src/components';
import { graphql } from 'react-apollo';
import { IRouterProps } from '@erxes/ui/src/types';
import { mutations, queries } from '../graphql';
import { router, withProps } from '@erxes/ui/src/utils/core';
import { withRouter } from 'react-router-dom';
import InventoryCategory from '../components/inventoryCategory/InventoryCategory';
import { CategoriesQueryResponse } from '../types';
type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  getCategoriesListQuery: CategoriesQueryResponse;
} & Props &
  IRouterProps;

type State = {};

class InventoryCategoryContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { getCategoriesListQuery } = this.props;
    if (getCategoriesListQuery.loading) {
      return <Spinner />;
    }
    const categories = getCategoriesListQuery.productCategories || [];
    const updatedProps = {
      ...this.props,
      loading: getCategoriesListQuery.loading,
      categories
    };

    const content = props => <InventoryCategory {...props} {...updatedProps} />;

    return <Bulk content={content} />;
  }
}

const generateParams = ({ queryParams }) => {
  const pageInfo = router.generatePaginationParams(queryParams || {});

  return {
    sortField: queryParams.sortField,
    sortDirection: Number(queryParams.sortDirection) || undefined,
    page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
    perPage: queryParams.perPage ? parseInt(queryParams.perPage, 10) : 20
  };
};

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, CategoriesQueryResponse>(
      gql(queries.getCategoryList),
      {
        name: 'getCategoriesListQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    )
  )(withRouter<IRouterProps>(InventoryCategoryContainer))
);
