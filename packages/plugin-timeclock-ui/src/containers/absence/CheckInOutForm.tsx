import {
  IAbsence,
  TimeClockMutationResponse,
  TimeClockQueryResponse,
  TimeLogsPerUserQueryResponse
} from '../../types';
import { Alert, withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries } from '../../graphql';
import CheckInOutForm from '../../components/absence/CheckInOutForm';
import React from 'react';
import { TimeClockMainQueryResponse } from '../../types';

type Props = {
  userId: string;
  startDate?: string;
  endDate?: string;

  absenceRequest: IAbsence;

  timeType: string;
  timeclockId?: string;
  timeclockStart?: Date;
  timeclockEnd?: Date;
  timeclockActive?: boolean;

  checkType?: string;
  contentProps?: any;
};

type FinalProps = {
  listTimeLogsPerUser: TimeLogsPerUserQueryResponse;
  listTimeclocksPerUser: TimeClockMainQueryResponse;
} & Props &
  TimeClockMutationResponse;

const ListContainer = (props: FinalProps) => {
  const {
    listTimeLogsPerUser,
    listTimeclocksPerUser,
    timeclockEditMutation
  } = props;

  const editTimeclock = values => {
    timeclockEditMutation({ variables: values })
      .then(() => Alert.success('Successfully edited time clock'))
      .catch(err => Alert.error(err.message));
  };

  const createTimeclock = values => {
    timeclockEditMutation({ variables: values })
      .then(() => Alert.success('Successfully edited time clock'))
      .catch(err => Alert.error(err.message));
  };

  const updatedProps = {
    ...props,
    createTimeclock,
    editTimeclock,
    timelogsPerUser: listTimeLogsPerUser.timeLogsPerUser || [],
    timeclocksPerUser: listTimeclocksPerUser.timeclocksPerUser || []
  };

  return <CheckInOutForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, TimeClockQueryResponse>(gql(queries.timeclocksPerUser), {
      name: 'listTimeclocksPerUser',
      options: ({ userId, startDate, endDate }) => ({
        variables: { userId, startDate, endDate },
        fetchPolicy: 'network-only'
      })
    }),

    graphql<Props, TimeClockQueryResponse>(gql(queries.timeLogsPerUser), {
      name: 'listTimeLogsPerUser',
      options: ({ userId, startDate, endDate }) => ({
        variables: { userId, startDate, endDate },
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
