import gql from 'graphql-tag';
import { queries } from '../graphql';

export const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.payments),
      variables: {
        paymentIds: []
      }
    },
    {
      query: gql(queries.paymentsTotalCountQuery)
    }
  ];
};
