import { Spinner, withProps } from '@erxes/ui/src';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import CarSection from '../components/common/CarSection';
import { mutations, queries } from '../graphql';
import { CarsQueryResponse, CustomersCarQueryResponse } from '../types';
import { Alert } from '@erxes/ui/src/utils';
import { DetailQueryResponse } from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  carsEditCustomer: any;
  carsEditCompany: any;
  carDetailQuery: DetailQueryResponse;
  carsQuery: CarsQueryResponse;
  customersCarQuery: CustomersCarQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const {
    id,
    carsQuery,
    carsEditCustomer,
    carsEditCompany,
    customersCarQuery
  } = props;

  if (carsQuery.loading || customersCarQuery.loading) {
    return <Spinner objective={true} />;
  }

  const cars = carsQuery.cars || [];
  const carsOnCustomer = customersCarQuery.carsFromCustomer || [];

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
        customersCarQuery.refetch();
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
        // customersCarQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const updatedProps = {
    ...props,
    id,
    cars,
    carsOnCustomer,
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
      name: 'customersCarQuery',
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
