import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import List from '../components/List';
import queryString from 'query-string';
import React from 'react';
import { graphql } from 'react-apollo';
import { IRouterProps } from '@erxes/ui/src/types';
import {
  OverallWorksCountQueryResponse,
  OverallWorksQueryResponse
} from '../types';
import { queries } from '../graphql';
import { withRouter } from 'react-router-dom';
import { Bulk, withProps, router, Spinner } from '@erxes/ui/src';
import { IQueryParams } from '@erxes/ui/src/types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  overallWorksQuery: OverallWorksQueryResponse;
  overallWorksCountQuery: OverallWorksCountQueryResponse;
} & Props &
  IRouterProps;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

class OverallWorksContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
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
    const { overallWorksQuery, overallWorksCountQuery } = this.props;

    if (overallWorksCountQuery.loading || overallWorksQuery.loading) {
      return <Spinner />;
    }

    const overallWorks = overallWorksQuery.overallWorks || [];

    const totalCount = overallWorksCountQuery.overallWorksCount || 0;

    const updatedProps = {
      ...this.props,
      overallWorks,
      totalCount,

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
      this.props.overallWorksQuery.refetch();
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
  startDate: queryParams.startDate,
  endDate: queryParams.endDate,
  branchId: queryParams.branchId,
  departmentId: queryParams.departmentId,
  productCategoryId: queryParams.productCategoryId,
  productId: queryParams.productId,
  jobCategoryId: queryParams.jobCategoryId,
  jobReferId: queryParams.jobReferId
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, OverallWorksQueryResponse, {}>(
      gql(queries.overallWorks),
      {
        name: 'overallWorksQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<{ queryParams: any }, OverallWorksCountQueryResponse, {}>(
      gql(queries.overallWorksCount),
      {
        name: 'overallWorksCountQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    )
  )(withRouter<IRouterProps>(OverallWorksContainer))
);
