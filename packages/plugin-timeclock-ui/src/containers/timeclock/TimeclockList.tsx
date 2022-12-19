import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils';
import List from '../../components/timeclock/TimeclockList';
import { TimeClockMutationResponse, TimeClockQueryResponse } from '../../types';
import { queries } from '../../graphql';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@erxes/ui/src/auth/types';

type Props = {
  currentUser: IUser;
  queryParams: any;
  history: any;
  startTime: Date;
  stopTime: Date;
  timeId: string;
  userId: string;

  queryStartDate: string;
  queryEndDate: string;
  queryUserIds: string[];
  queryDepartmentIds: string[];
  queryBranchIds: string[];

  getActionBar: (actionBar: any) => void;
};

type FinalProps = {
  listTimeclocksQuery: TimeClockQueryResponse;
} & Props &
  TimeClockMutationResponse;

const ListContainer = (props: FinalProps) => {
  const { listTimeclocksQuery, currentUser } = props;

  if (listTimeclocksQuery.loading) {
    return <Spinner />;
  }

  const currentUserId = currentUser._id;

  const updatedProps = {
    ...props,
    currentUserId,
    timeclocks: listTimeclocksQuery.timeclocks || [],
    loading: listTimeclocksQuery.loading
  };

  return <List {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, TimeClockQueryResponse>(gql(queries.list), {
      name: 'listTimeclocksQuery',
      options: ({
        queryStartDate,
        queryEndDate,
        queryUserIds,
        queryDepartmentIds,
        queryBranchIds
      }) => ({
        variables: {
          startDate: queryStartDate,
          endDate: queryEndDate,
          userIds: queryUserIds,
          departmentIds: queryDepartmentIds,
          branchIds: queryBranchIds
        },
        fetchPolicy: 'network-only'
      })
    })
  )(withCurrentUser(ListContainer))
);
