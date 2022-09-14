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
  ToCheckProductsMutationResponse
} from '../types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  getProductsListQuery: ProductsQueryResponse;
} & Props &
  IRouterProps &
  ToCheckProductsMutationResponse;

type State = {
  items: any;
  loading: boolean;
};

class InventoryProductsContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      loading: false
    };
  }

  render() {
    const { getProductsListQuery } = this.props;
    const { items, loading } = this.state;
    const toCheckProducts = (productCodes: string[]) => {
      this.setState({ loading: true });
      this.props
        .toCheckProducts({
          variables: { productCodes }
        })
        .then(response => {
          this.setState({ items: response.data.toCheckProducts });
          this.setState({ loading: false });
        })
        .catch(e => {
          Alert.error(e.message);
          this.setState({ loading: false });
        });
    };

    if (getProductsListQuery.loading) {
      return <Spinner />;
    }
    const products = getProductsListQuery.products || [];
    const updatedProps = {
      ...this.props,
      loading: getProductsListQuery.loading || loading,
      products,
      toCheckProducts,
      items
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
    graphql<Props, ToCheckProductsMutationResponse, { productCodes: string[] }>(
      gql(mutations.toCheckProducts),
      {
        name: 'toCheckProducts'
      }
    )
  )(withRouter<IRouterProps>(InventoryProductsContainer))
);
