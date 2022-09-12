import * as compose from 'lodash.flowright';
import Alert from '@erxes/ui/src/utils/Alert';
import gql from 'graphql-tag';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { Bulk } from '@erxes/ui/src/components';
import { graphql } from 'react-apollo';
import { IRouterProps } from '@erxes/ui/src/types';
import { mutations, queries } from '../graphql';
import { withProps } from '@erxes/ui/src/utils/core';
import { withRouter } from 'react-router-dom';
import InventoryCategory from '../components/inventoryCategory/InventoryCategory';
import {
  CategoriesQueryResponse,
  ToSyncCategoriesMutationResponse
} from '../types';
type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  getCategoriesListQuery: CategoriesQueryResponse;
} & Props &
  IRouterProps &
  ToSyncCategoriesMutationResponse;

type State = {};

class InventoryCategoryContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { getCategoriesListQuery } = this.props;
    const toSyncCategories = (
      categoryCodes: string[],
      categoryIds: string[],
      operation: string
    ) => {
      this.props
        .toSyncCategories({
          variables: { categoryCodes, categoryIds, operation }
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };
    if (getCategoriesListQuery.loading) {
      return <Spinner />;
    }
    const categories = getCategoriesListQuery.productCategories || [];

    const updatedProps = {
      ...this.props,
      loading: getCategoriesListQuery.loading,
      categories,
      toSyncCategories
    };

    const content = props => <InventoryCategory {...props} {...updatedProps} />;

    return <Bulk content={content} />;
  }
}

const generateParams = ({ queryParams }) => {
  return {
    erkhetPage: queryParams.erkhetPage
      ? parseInt(queryParams.erkhetPage, 10)
      : 1,
    erkhetPerPage: queryParams.erkhetPerPage
      ? parseInt(queryParams.erkhetPerPage, 10)
      : 20,
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
    ),
    graphql<
      Props,
      ToSyncCategoriesMutationResponse,
      { categoryIds: string[]; categoryCodes: string[]; operation: string }
    >(gql(mutations.toSyncCategories), {
      name: 'toSyncCategories'
    })
  )(withRouter<IRouterProps>(InventoryCategoryContainer))
);
