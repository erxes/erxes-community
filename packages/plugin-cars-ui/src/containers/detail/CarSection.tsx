import { Spinner, withProps } from '@erxes/ui/src';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import CarSection from '../../components/detail/CarSection';
import { mutations, queries } from '../../graphql';
import {
  CarsQueryResponse,
  CustomersCarQueryResponse,
  CompaniesCarQueryResponse
} from '../../types';
import { Alert } from '@erxes/ui/src/utils';
import { DetailQueryResponse } from '../../types';

type Props = {
  id: string;
  type: string;
};

type FinalProps = {
  carsEditCustomer: any;
  carsEditCompany: any;
  carDetailQuery: DetailQueryResponse;
  carsQuery: CarsQueryResponse;
  carsFromCustomerQuery: CustomersCarQueryResponse;
  carsFromCompanyQuery: CompaniesCarQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const {
    id,
    type,
    carsQuery,
    carsEditCustomer,
    carsEditCompany,
    carsFromCustomerQuery,
    carsFromCompanyQuery
  } = props;

  if (carsQuery.loading || carsFromCustomerQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (carsQuery.loading || carsFromCompanyQuery.loading) {
    return <Spinner objective={true} />;
  }

  const cars = carsQuery.cars || [];
  const carsOnCustomer = carsFromCustomerQuery.carsFromCustomer || [];
  const carsOnCompany = carsFromCompanyQuery.carsFromCompany || [];

  const carsEditOnCustomer = variables => {
    carsEditCustomer({
      variables: {
        _id: '',
        customerId: id,
        ...variables
      }
    })
      .then(() => {
        Alert.success('You successfully updated a car');
        carsFromCustomerQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const carsEditOnCompany = variables => {
    carsEditCompany({
      variables: {
        _id: '',
        companyId: id,
        ...variables
      }
    })
      .then(() => {
        Alert.success('You successfully updated a company');
        carsFromCompanyQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const updatedProps = {
    ...props,
    id,
    type,
    cars,
    carsOnCustomer,
    carsOnCompany,
    loading: carsQuery.loading,
    carsEditOnCustomer,
    carsEditOnCompany
  };

  return (
    <>
      <CarSection {...updatedProps} />
    </>
  );
};

export default withProps<Props>(
  compose(
    graphql<Props, DetailQueryResponse, { _id: string }>(
      gql(queries.carDetail),
      {
        name: 'carDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id
          }
        })
      }
    ),
    graphql<Props, { _id: string }>(gql(queries.carsFromCustomer), {
      name: 'carsFromCustomerQuery',
      options: ({ id }) => ({
        variables: {
          customerId: id
        }
      })
    }),
    graphql<Props, { _id: string }>(gql(queries.carsFromCompany), {
      name: 'carsFromCompanyQuery',
      options: ({ id }) => ({
        variables: {
          customerId: id
        }
      })
    }),
    graphql<Props>(gql(queries.cars), {
      name: 'carsQuery',
      options: () => ({
        variables: {
          isSelect: true
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, { _id: string }>(gql(mutations.carsEditOnCustomer), {
      name: 'carsEditCustomer',
      options: () => ({
        refetchQueries: ['carsMain', 'carsTotalCount']
      })
    }),
    graphql<Props, { _id: string }>(gql(mutations.carsEditOnCompany), {
      name: 'carsEditCompany',
      options: () => ({
        // refetchQueries: ['carsMain', 'carsTotalCount']
      })
    })
  )(CarDetailsContainer)
);
