import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { Alert, withProps } from '@erxes/ui/src/utils';
import List from '../../components/timeclock/TimeclockList';
import {
  TimeClockMainQueryResponse,
  TimeClockMutationResponse,
  TimeClockQueryResponse
} from '../../types';
import { queries } from '../../graphql';
import React, { useState } from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { mutations } from '../../graphql';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';

type Props = {
  queryParams: any;
  history: any;

  queryStartDate: string;
  queryEndDate: string;
  queryUserIds: string[];
  queryDepartmentIds: string[];
  queryBranchIds: string[];
  queryPage: number;
  queryPerPage: number;

  getActionBar: (actionBar: any) => void;
  getPagination: (pagination: any) => void;
};

type FinalProps = {
  timeclocksMainQuery: TimeClockMainQueryResponse;
} & Props &
  TimeClockMutationResponse;

const ListContainer = (props: FinalProps) => {
  const {
    timeclocksMainQuery,
    getPagination,
    extractAllMySqlDataMutation
  } = props;
  const [loading, setLoading] = useState(false);

  if (timeclocksMainQuery.loading || loading) {
    return <Spinner />;
  }

  const extractAllMySqlData = () => {
    setLoading(true);
    extractAllMySqlDataMutation()
      .then(() => {
        setLoading(false);
        timeclocksMainQuery.refetch();
        Alert.success('Successfully extracted data');
      })
      .catch(e => {
        setLoading(false);
        Alert.error(e.message);
      });
  };

  const { list = [], totalCount = 0 } =
    timeclocksMainQuery.timeclocksMain || {};

  const updatedProps = {
    ...props,
    totalCount,
    timeclocks: list,
    loading: timeclocksMainQuery.loading || loading,
    extractAllMySqlData
  };

  getPagination(<Pagination count={totalCount} />);
  return <List {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, TimeClockQueryResponse>(gql(queries.listTimeclocksMain), {
      name: 'timeclocksMainQuery',
      options: ({
        queryStartDate,
        queryEndDate,
        queryUserIds,
        queryDepartmentIds,
        queryBranchIds,
        queryPage,
        queryPerPage
      }) => ({
        variables: {
          startDate: queryStartDate,
          endDate: queryEndDate,
          userIds: queryUserIds,
          departmentIds: queryDepartmentIds,
          branchIds: queryBranchIds,
          page: queryPage,
          perPage: queryPerPage
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, TimeClockMutationResponse>(
      gql(mutations.extractAllDataFromMySQL),
      {
        name: 'extractAllMySqlDataMutation'
      }
    )
  )(ListContainer)
);
