import {
  ITimeclock,
  TimeClockMutationResponse,
  TimeClockQueryResponse,
  TimeLogsPerUserQueryResponse
} from '../../types';
import { Alert, withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { mutations, queries } from '../../graphql';
import CheckoutForm from '../../components/timeclock/CheckoutForm';
import React from 'react';
import { TimeClockMainQueryResponse } from '../../types';

type Props = {
  userId: string;
  startDate?: string;
  endDate?: string;

  timeclockId?: string;
  timeclockStart?: Date;
  timeclockEnd?: Date;
  timeclockActive?: boolean;
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

  const timeclockEdit = values => {
    timeclockEditMutation({ variables: values })
      .then(() => Alert.success('Successfully edited time clock'))
      .catch(err => Alert.error(err.message));
  };

  const updatedProps = {
    ...props,
    timeclockEdit,
    timelogsPerUser: listTimeLogsPerUser.timeLogsPerUser || [],
    activeTimeclocksPerUser: listTimeclocksPerUser.timeclocksMain.list || []
  };

  return <CheckoutForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, TimeClockQueryResponse>(gql(queries.timeclocksMain), {
      name: 'timeclocksMainQuery',
      options: ({ userId }) => ({
        variables: { userIds: [userId] },
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
