import { getEnv, withProps } from '@erxes/ui/src/utils/core';
import queryString from 'query-string';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import LogsList from '../../components/logs/LogsList';
import { queries } from '../../graphql';
import {
  BranchesQueryResponse,
  LogsQueryResponse,
  ReportsQueryResponse
} from '../../types';
import Spinner from '@erxes/ui/src/components/Spinner';
import { generateParams } from '../../utils';

type Props = {
  history: any;
  queryParams: any;
  searchValue?: string;

  reportType?: string;

  getActionBar: (actionBar: any) => void;
  showSideBar: (sideBar: boolean) => void;
  getPagination: (pagination: any) => void;
};

type FinalProps = {
  listTimelogsQuery: LogsQueryResponse;
} & Props;

const ListContainer = (props: FinalProps) => {
  const { listTimelogsQuery, queryParams } = props;
  const { branchId, deptId } = queryParams;

  // if (listTimelogsQuery.loading) {
  //   return <Spinner />;
  // }

  // const { list = [], totalCount = 0 } = listTimelogsQuery.timelogs;

  const updatedProps = {
    ...props,
    // timelogs: list,
    // totalCount,
    branchId,
    deptId
  };

  return <LogsList {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, ReportsQueryResponse>(gql(queries.listReports), {
      name: 'listReportsQuery',
      options: ({ queryParams, reportType }) => ({
        variables: {
          ...generateParams(queryParams),
          reportType
        },
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
