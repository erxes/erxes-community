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
import InventoryProducts from '../components/inventoryProducts/InventoryProducts';
import { ErkhetProductsQueryResponse, ProductsQueryResponse } from '../types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  getProductsListQuery: ProductsQueryResponse;
  getErkhetProductsListQuery: ErkhetProductsQueryResponse;
} & Props &
  IRouterProps;

type State = {};

class InventoryProductsContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { getProductsListQuery, getErkhetProductsListQuery } = this.props;

    if (getProductsListQuery.loading || getErkhetProductsListQuery.loading) {
      return <Spinner />;
    }
    const products = getProductsListQuery.products || [];
    const erkhetProducts =
      getErkhetProductsListQuery.getProductsErkhet.slice(0, 50) || [];
    const updatedProps = {
      ...this.props,
      loading: getProductsListQuery.loading,
      products,
      erkhetProducts
    };

    const content = props => <InventoryProducts {...props} {...updatedProps} />;

    return <Bulk content={content} />;
  }
}

const generateParams = ({ queryParams }) => {
  return {
    page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
    perPage: queryParams.perPage ? parseInt(queryParams.perPage, 10) : 20
  };
};

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, ProductsQueryResponse>(
      gql(queries.getProductsList),
      {
        name: 'getProductsListQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<{ queryParams: any }, ErkhetProductsQueryResponse>(
      gql(queries.getErkhetProductsList),
      {
        name: 'getErkhetProductsListQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    )
  )(withRouter<IRouterProps>(InventoryProductsContainer))
);
