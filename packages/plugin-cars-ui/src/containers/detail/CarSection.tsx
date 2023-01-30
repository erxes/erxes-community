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
  carsOfCustomerQuery: CustomersCarQueryResponse;
  carsOfCompanyQuery: CompaniesCarQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const {
    id,
    type,
    carsEditCustomer,
    carsEditCompany,
    carsOfCustomerQuery,
    carsOfCompanyQuery
  } = props;

  const carsInfo = () => {
    if (type === 'contact') {
      return carsOfCustomerQuery.carsOfCustomer || [];
    } else {
      return carsOfCompanyQuery.carsOfCompany || [];
    }
  };
  const carsOnCustomerOrCompany = carsInfo();

  const carsEditOnCustomer = variables => {
    carsEditCustomer({
      variables: {
        customerId: id,
        ...variables
      }
    })
      .then(() => {
        Alert.success('You successfully updated a car');
        carsOfCustomerQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const carsEditOnCompany = variables => {
    carsEditCompany({
      variables: {
        companyId: id,
        ...variables
      }
    })
      .then(() => {
        Alert.success('You successfully updated a company');
        carsOfCompanyQuery.refetch();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const updatedProps = {
    ...props,
    id,
    type,
    carsOnCustomerOrCompany,
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
    graphql<Props, { _id: string }>(gql(queries.carsOfCustomer), {
      name: 'carsOfCustomerQuery',
      options: ({ id }) => ({
        variables: {
          customerId: id
        }
      })
    }),
    graphql<Props, { _id: string }>(gql(queries.carsOfCompany), {
      name: 'carsOfCompanyQuery',
      options: ({ id }) => ({
        variables: {
          companyId: id
        }
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
        refetchQueries: ['carsMain', 'carsTotalCount']
      })
    })
  )(CarDetailsContainer)
);
