import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import ConfigList from '../components/ConfigList';
import {
  AbsenceMutationResponse,
  AbsenceTypeQueryResponse,
  ConfigMutationResponse,
  PayDatesQueryResponse,
  HolidaysQueryResponse
} from '../types';
import { mutations, queries } from '../graphql';
import { Alert, confirm } from '@erxes/ui/src/utils';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  history: any;
  queryParams: any;
  absenceTypeId: string;
  absenceName: string;
  attachment: boolean;
  explanation: boolean;
  userId: string;
  reason: string;
  startTime: Date;
  endTime: Date;
  absenceId: string;
  absenceStatus: string;
  payDates: number[];
  queryStartDate: Date;
  queryEndDate: Date;
  queryUserId: string;
};

type FinalProps = {
  listAbsenceTypesQuery: AbsenceTypeQueryResponse;
  listPayDatesQuery: PayDatesQueryResponse;
  listHolidaysQuery: HolidaysQueryResponse;
} & Props &
  ConfigMutationResponse;

const ListContainer = (props: FinalProps) => {
  const {
    removeAbsenceTypeMutation,
    addPayDateMutation,
    editPayDateMutation,
    removePayDateMutation,
    removeHolidayMutation,
    listAbsenceTypesQuery,
    listPayDatesQuery,
    listHolidaysQuery
  } = props;

  const renderButton = ({
    values,
    isSubmitted,
    callback,
    object,
    name
  }: IButtonMutateProps) => {
    let mutation;
    if (name === 'absenceType') {
      mutation = object ? mutations.absenceTypeEdit : mutations.absenceTypeAdd;
    }

    if (name === 'holiday') {
      mutation = object ? mutations.holidayEdit : mutations.holidayAdd;
    }

    return (
      <ButtonMutate
        mutation={mutation}
        variables={values}
        callback={callback}
        refetchQueries={[
          {
            query: gql(queries.listAbsenceTypes)
          },
          {
            query: gql(queries.listHolidays)
          }
        ]}
        isSubmitted={isSubmitted}
        btnStyle="primary"
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } ${name}`}
      />
    );
  };

  const removeAbsenceType = absenceId => {
    confirm('Are you sure to remove this absence type').then(() => {
      removeAbsenceTypeMutation({ variables: { _id: absenceId } })
        .then(() => Alert.success('Successfully removed an absence type'))
        .catch(err => {
          throw new Error(err);
        });
    });
  };

  const submitPayDatesConfig = (payDates: number[]) => {
    confirm('Are you sure to submit these dates as pay dates ? ').then(() => {
      addPayDateMutation({ variables: { dateNums: payDates } })
        .then(() => Alert.success('Successfully submitted pay dates'))
        .catch(err => {
          throw new Error(err);
        });
    });
  };

  const removeHolidayConfig = (_id: string) => {
    confirm('Are you sure to remove this holiday').then(() => {
      removeHolidayMutation({ variables: { _id: `${_id}` } })
        .then(() => Alert.success('Successfully removed holiday'))
        .catch(err => {
          throw new Error(err);
        });
    });
  };

  console.log(listPayDatesQuery.payDates);

  const updatedProps = {
    ...props,
    absenceTypes: listAbsenceTypesQuery.absenceTypes,
    payDates: listPayDatesQuery.payDates || [],
    removeAbsenceType,
    removeHolidayConfig,
    renderButton,
    submitPayDatesConfig
  };
  return <ConfigList {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, AbsenceTypeQueryResponse>(gql(queries.listAbsenceTypes), {
      name: 'listAbsenceTypesQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, PayDatesQueryResponse>(gql(queries.listPayDates), {
      name: 'listPayDatesQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, PayDatesQueryResponse>(gql(queries.listHolidays), {
      name: 'listHolidaysQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),

    graphql<Props, AbsenceMutationResponse>(gql(mutations.absenceTypeRemove), {
      name: 'removeAbsenceTypeMutation',
      options: ({ absenceId }) => ({
        variables: {
          _id: absenceId
        },
        refetchQueries: ['absenceTypes']
      })
    }),

    graphql<Props, AbsenceMutationResponse>(gql(mutations.absenceTypeAdd), {
      name: 'addAbsenceType',
      options: ({ absenceName, explanation, attachment }) => ({
        variables: {
          name: absenceName,
          explRequired: explanation,
          attachRequired: attachment
        },
        refetchQueries: ['absenceTypes']
      })
    }),

    graphql<Props, AbsenceMutationResponse>(gql(mutations.absenceTypeEdit), {
      name: 'editAbsenceType',
      options: ({ absenceId, absenceName, explanation, attachment }) => ({
        variables: {
          _id: absenceId,
          name: absenceName,
          explRequired: explanation,
          attachRequired: attachment
        },
        refetchQueries: ['absenceTypes']
      })
    }),

    graphql<Props, ConfigMutationResponse>(gql(mutations.payDateAdd), {
      name: 'addPayDateMutation',
      options: ({ payDates }) => ({
        variables: {
          dateNums: payDates
        },
        refetchQueries: ['absenceTypes']
      })
    }),
    graphql<Props, ConfigMutationResponse>(gql(mutations.holidayRemove), {
      name: 'removeHolidayMutation',
      options: ({ payDates }) => ({
        variables: {
          dateNums: payDates
        },
        refetchQueries: ['absenceTypes']
      })
    })
  )(ListContainer)
);
