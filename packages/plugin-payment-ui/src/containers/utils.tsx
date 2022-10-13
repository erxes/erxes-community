import { queries } from '../graphql';

export const getRefetchQueries = () => {
  return [
    {
      query: queries.payments,
      variables: {
        paymentIds: []
      }
    },
    {
      query: queries.paymentsTotalCountQuery
    }
  ];
};
