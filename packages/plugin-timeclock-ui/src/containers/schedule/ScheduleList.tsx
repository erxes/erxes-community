import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import ScheduleList from '../../components/schedule/ScheduleList';
import {
  BranchesQueryResponse,
  IScheduleConfig,
  IShift,
  ScheduleMutationResponse,
  ScheduleQueryResponse
} from '../../types';
import { mutations, queries } from '../../graphql';
import { Alert, confirm } from '@erxes/ui/src/utils';
import { IBranch } from '@erxes/ui/src/team/types';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';

type Props = {
  history: any;
  queryParams: any;
  userId?: string;
  userIds?: string[];
  scheduleId?: string;
  scheduleStatus?: string;
  shiftId?: string;
  shiftStatus?: string;
  requestedShifts?: IShift[];
  scheduleConfigs: IScheduleConfig[];

  branchesList: IBranch[];

  queryStartDate: string;
  queryEndDate: string;
  queryUserIds: string[];
  queryBranchIds: string[];
  queryDepartmentIds: string[];
  queryPage: number;
  queryPerPage: number;
  getActionBar: (actionBar: any) => void;
  showSideBar: (sideBar: boolean) => void;
  getPagination: (pagination: any) => void;
};

type FinalProps = {
  listSchedulesMain: ScheduleQueryResponse;
  listBranchesQuery: BranchesQueryResponse;
} & Props &
  ScheduleMutationResponse;

const ListContainer = (props: FinalProps) => {
  const {
    sendScheduleReqMutation,
    submitScheduleMutation,
    solveScheduleMutation,
    solveShiftMutation,
    removeScheduleMutation,
    removeScheduleShiftMutation,
    getPagination,
    showSideBar,
    listSchedulesMain
  } = props;

  const solveSchedule = (scheduleId: string, status: string) => {
    solveScheduleMutation({
      variables: { _id: scheduleId, status: `${status}` }
    });
  };

  const solveShift = (shiftId: string, status: string) => {
    solveShiftMutation({
      variables: { _id: shiftId, status: `${status}` }
    });
  };

  const submitRequest = (
    selectedUserIds: string[],
    requestedShifts: IShift[]
  ) => {
    sendScheduleReqMutation({
      variables: {
        userId: `${selectedUserIds}`,
        shifts: requestedShifts
      }
    })
      .then(() => Alert.success('Successfully sent a schedule request'))
      .catch(err => Alert.error(err.message));
  };

  const submitSchedule = (
    selectedBranchIds: string[],
    selectedDeptIds: string[],
    selectedUserIds: string[],
    requestedShifts: IShift[]
  ) => {
    submitScheduleMutation({
      variables: {
        branchIds: selectedBranchIds,
        departmentIds: selectedDeptIds,
        userIds: selectedUserIds,
        shifts: requestedShifts
      }
    })
      .then(() => Alert.success('Successfully sent a schedule request'))
      .catch(err => Alert.error(err.message));
  };

  const removeScheduleShifts = (scheduleId, type) => {
    confirm(`Are you sure to remove schedele ${type}`).then(() => {
      (type === 'shift'
        ? removeScheduleShiftMutation({ variables: { _id: scheduleId } })
        : removeScheduleMutation({ variables: { _id: scheduleId } })
      ).then(() => Alert.success(`Successfully removed schedule ${type}`));
    });
  };

  const { list = [], totalCount = 0 } = listSchedulesMain.schedulesMain || [];

  const updatedProps = {
    ...props,
    scheduleOfMembers: list,
    loading: listSchedulesMain.loading,
    solveSchedule,
    solveShift,
    submitRequest,
    submitSchedule,
    removeScheduleShifts
  };

  showSideBar(true);
  getPagination(<Pagination count={totalCount} />);
  return <ScheduleList {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, ScheduleQueryResponse>(gql(queries.listSchedulesMain), {
      name: 'listSchedulesMain',
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
    graphql<Props, ScheduleMutationResponse>(
      gql(mutations.sendScheduleRequest),
      {
        name: 'sendScheduleReqMutation',
        options: ({ userId, requestedShifts }) => ({
          variables: {
            userId: `${userId}`,
            shifts: requestedShifts
          },
          refetchQueries: ['listSchedulesMain']
        })
      }
    ),
    graphql<Props, ScheduleMutationResponse>(gql(mutations.submitSchedule), {
      name: 'submitScheduleMutation',
      options: ({ userIds, requestedShifts }) => ({
        variables: {
          userIds: `${userIds}`,
          shifts: `${requestedShifts}`
        },
        refetchQueries: ['listSchedulesMain']
      })
    }),
    graphql<Props, ScheduleMutationResponse>(gql(mutations.solveSchedule), {
      name: 'solveScheduleMutation',
      options: ({ scheduleId, scheduleStatus }) => ({
        variables: {
          _id: scheduleId,
          status: scheduleStatus
        },
        refetchQueries: ['listSchedulesMain']
      })
    }),

    graphql<Props, ScheduleMutationResponse>(gql(mutations.solveShift), {
      name: 'solveShiftMutation',
      options: ({ shiftId, shiftStatus }) => ({
        variables: {
          _id: shiftId,
          status: shiftStatus
        },
        refetchQueries: ['listSchedulesMain']
      })
    }),
    graphql<Props, ScheduleMutationResponse>(gql(mutations.scheduleRemove), {
      name: 'removeScheduleMutation',
      options: ({ scheduleId }) => ({
        variables: {
          _id: scheduleId
        },
        refetchQueries: ['listSchedulesMain']
      })
    }),

    graphql<Props, ScheduleMutationResponse>(
      gql(mutations.scheduleShiftRemove),
      {
        name: 'removeScheduleShiftMutation',
        options: ({ shiftId }) => ({
          variables: {
            _id: shiftId
          },
          refetchQueries: ['listSchedulesMain']
        })
      }
    )
  )(ListContainer)
);
