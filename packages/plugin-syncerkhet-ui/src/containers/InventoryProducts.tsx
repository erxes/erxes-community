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
import InventoryProducts from '../components/inventoryProducts/InventoryProducts';
import {
  ProductsQueryResponse,
  ToSyncProductsMutationResponse
} from '../types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  getProductsListQuery: ProductsQueryResponse;
} & Props &
  IRouterProps &
  ToSyncProductsMutationResponse;

type State = {};

class InventoryProductsContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { getProductsListQuery } = this.props;

    const toSyncProducts = (productIds: string[], productCodes: string[]) => {
      this.props
        .toSyncProducts({
          variables: { productCodes, productIds }
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    if (getProductsListQuery.loading) {
      return <Spinner />;
    }
    const products = getProductsListQuery.products || [];
    const updatedProps = {
      ...this.props,
      loading: getProductsListQuery.loading,
      products,
      toSyncProducts
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
    graphql<
      Props,
      ToSyncProductsMutationResponse,
      { productCodes: string[]; productIds: string[] }
    >(gql(mutations.toSyncProducts), {
      name: 'toSyncProducts'
    })
  )(withRouter<IRouterProps>(InventoryProductsContainer))
);
