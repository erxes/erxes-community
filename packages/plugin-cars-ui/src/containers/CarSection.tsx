import { EmptyState, Spinner, withProps } from '@erxes/ui/src';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import CarSection from '../components/common/CarSection';
import { queries } from '../graphql';
import { CarsQueryResponse } from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  carsQuery: CarsQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const { carsQuery } = props;

  if (carsQuery.loading) {
    return <Spinner objective={true} />;
  }
  const cars = carsQuery.cars || [];

  const updatedProps = {
    ...props,
    loading: carsQuery.loading,
    cars
  };

  return (
    <>
      <CarSection {...updatedProps} />
    </>
  );
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.cars), {
      name: 'carsQuery',
      options: () => ({
        variables: {
          isSelect: true
        }
      })
    })
  )(CarDetailsContainer)
);
