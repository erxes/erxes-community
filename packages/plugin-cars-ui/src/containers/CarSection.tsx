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
  carEdit: any;
  carDetailQuery: DetailQueryResponse;
  carsQuery: CarsQueryResponse;
  customersCarQuery: CustomersCarQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const { carsQuery, carEdit, id, carDetailQuery, customersCarQuery } = props;

  if (carsQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (customersCarQuery.loading) {
    return <Spinner objective={true} />;
  }
  const cars = carsQuery.cars || [];
  const customerCar = customersCarQuery.customersCar || [];

  const customerOfCarEdit = variables => {
    carEdit({
      variables: {
        _id: id,
        cusId: id,
        ...variables
      }
    })
      .then(() => {
        Alert.success('You successfully updated a car');
        carDetailQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const updatedProps = {
    ...props,
    loading: carsQuery.loading,
    cars,
    customerOfCarEdit,
    id,
    customerCar
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
    graphql<Props, { _id: string }>(gql(queries.customersCar), {
      name: 'customersCarQuery',
      options: ({ id }) => ({
        variables: {
          _id: id
        }
      })
    }),
    graphql<Props>(gql(queries.cars), {
      name: 'carsQuery',
      options: () => ({
        variables: {
          isSelect: true
        }
      })
    }),
    graphql<Props, { _id: string }>(gql(mutations.customerOfCarEdit), {
      name: 'carEdit',
      options: () => ({
        refetchQueries: ['carsMain', 'carsTotalCount']
      })
    })
  )(CarDetailsContainer)
);
