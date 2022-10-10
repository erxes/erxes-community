import Spinner from '@erxes/ui/src/components/Spinner';
import { IFormProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';

import SelectPayments from '../components/SelectPayments';
import { queries } from '../graphql';
import { PaymentConfigsQueryResponse } from '../types';

type Props = {
  onChange: (values: string[]) => void;
  defaultValue: string[];
  isRequired?: boolean;
  formProps: IFormProps;
  description?: string;
};

type FinalProps = {
  paymentsQuery: PaymentConfigsQueryResponse;
} & Props;

const SelectPaymentsContainer = (props: ChildProps<FinalProps>) => {
  console.log('paymentssssss');
  const { paymentsQuery } = props;

  const payments = paymentsQuery.paymentConfigs || [];

  if (paymentsQuery.loading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    ...props,
    payments
  };

  return <SelectPayments {...updatedProps} />;
};

export default compose(
  graphql<PaymentConfigsQueryResponse>(gql(queries.paymentConfigs), {
    name: 'paymentsQuery',
    options: () => ({
      variables: { status: 'active' }
    })
  })
)(SelectPaymentsContainer);
