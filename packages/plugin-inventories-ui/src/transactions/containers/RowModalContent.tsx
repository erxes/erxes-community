import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
// local
import { queries } from '../graphql';
import RowModalContentComponent from '../components/RowModalContent';

type Props = {
  data: any;
};

const RowModalContentContainer = (props: Props) => {
  const { data } = props;

  // Hooks
  const transactionDetail = useQuery(gql(queries.transactionDetail), {
    variables: { id: data._id },
    fetchPolicy: 'network-only'
  });

  return (
    <RowModalContentComponent
      loading={transactionDetail.loading}
      detail={
        transactionDetail.data ? transactionDetail.data.transactionDetail : []
      }
    />
  );
};

export default compose()(RowModalContentContainer);
