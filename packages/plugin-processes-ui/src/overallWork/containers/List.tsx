import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import List from '../components/List';
import queryString from 'query-string';
import React from 'react';
import { graphql } from 'react-apollo';
import { IRouterProps } from '@erxes/ui/src/types';
import {
  ListQueryVariables,
  WorksQueryResponse,
  WorksSummaryQueryResponse
} from '../types';
import { mutations, queries } from '../graphql';
import { withRouter } from 'react-router-dom';
import { Bulk, withProps, router, Alert, Spinner } from '@erxes/ui/src';
import { IQueryParams } from '@erxes/ui/src/types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  ordersQuery: WorksQueryResponse;
  ordersSummaryQuery: WorksSummaryQueryResponse;
} & Props &
  IRouterProps;

type State = {
  loading: boolean;
};

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

class OrdersContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  onSearch = (search: string) => {
    router.removeParams(this.props.history, 'page');

    if (!search) {
      return router.removeParams(this.props.history, 'search');
    }

    router.setParams(this.props.history, { search });
  };

  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);
    router.removeParams(this.props.history, 'page');

    if (params[key] === values) {
      return router.removeParams(this.props.history, key);
    }

    return router.setParams(this.props.history, { [key]: values });
  };

  onFilter = (filterParams: IQueryParams) => {
    router.removeParams(this.props.history, 'page');

    for (const key of Object.keys(filterParams)) {
      if (filterParams[key]) {
        router.setParams(this.props.history, { [key]: filterParams[key] });
      } else {
        router.removeParams(this.props.history, key);
      }
    }

    return router;
  };

  isFiltered = (): boolean => {
    const params = generateQueryParams(this.props.history);

    for (const param in params) {
      if ([''].includes(param)) {
        return true;
      }
    }

    return false;
  };

  clearFilter = () => {
    const params = generateQueryParams(this.props.history);
    router.removeParams(this.props.history, ...Object.keys(params));
  };

  render() {
    const { ordersQuery, ordersSummaryQuery } = this.props;

    if (ordersSummaryQuery.loading || ordersQuery.loading) {
      return <Spinner />;
    }

    const summary = ordersSummaryQuery.worksSummary;
    const list = ordersQuery.works || [];

    const updatedProps = {
      ...this.props,
      orders: list,
      summary,
      loading: ordersQuery.loading,

      onFilter: this.onFilter,
      onSelect: this.onSelect,
      onSearch: this.onSearch,
      isFiltered: this.isFiltered(),
      clearFilter: this.clearFilter
    };

    const ordersList = props => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.ordersQuery.refetch();
    };

    return <Bulk content={ordersList} refetch={refetch} />;
  }
}

const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  sortField: queryParams.sortField,
  sortDirection: queryParams.sortDirection
    ? parseInt(queryParams.sortDirection, 10)
    : undefined,
  search: queryParams.search,
  paidStartDate: queryParams.paidStartDate,
  paidEndDate: queryParams.paidEndDate,
  createdStartDate: queryParams.createdStartDate,
  createdEndDate: queryParams.createdEndDate,
  paidDate: queryParams.paidDate,
  userId: queryParams.userId,
  customerId: queryParams.customerId,
  posId: queryParams.posId
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, WorksQueryResponse, ListQueryVariables>(
      gql(queries.posOrders),
      {
        name: 'ordersQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<
      { queryParams: any },
      WorksSummaryQueryResponse,
      ListQueryVariables
    >(gql(queries.posOrdersSummary), {
      name: 'ordersSummaryQuery',
      options: ({ queryParams }) => ({
        variables: generateParams({ queryParams }),
        fetchPolicy: 'network-only'
      })
    })
  )(withRouter<IRouterProps>(OrdersContainer))
);
