import Spinner from '@erxes/ui/src/components/Spinner';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';

import SelectPayments from '../components/SelectPayments';
import { mutations, queries } from '../graphql';
import {
  PaymentConfigQueryResponse,
  PaymentsQueryResponse,
  SetPaymentConfigMutationResponse
} from '../types';

type Props = {
  contentType: string;
  contentTypeId: string;
};

type FinalProps = {
  paymentsQuery: PaymentsQueryResponse;
  paymentConfigQuery: PaymentConfigQueryResponse;
} & Props &
  SetPaymentConfigMutationResponse;

const SelectPaymentsContainer = (props: ChildProps<FinalProps>) => {
  const [paymentIds, setPaymentIds] = React.useState<string[]>([]);

  const { paymentsQuery, paymentConfigQuery } = props;

  if (
    paymentsQuery.loading ||
    (paymentConfigQuery && paymentConfigQuery.loading)
  ) {
    return <Spinner objective={true} />;
  }

  const payments = paymentsQuery.payments || [];

  const defaultValue = paymentConfigQuery
    ? paymentConfigQuery.getPaymentConfig.paymentIds
    : [];

  const onChange = value => {
    setPaymentIds(value.map(item => item.value));

    console.log(paymentIds);
  };

  const updatedProps = {
    ...props,
    defaultValue: paymentIds,
    payments,
    onChange
  };

  return <SelectPayments {...updatedProps} />;
};

export default compose(
  graphql<PaymentsQueryResponse>(gql(queries.payments), {
    name: 'paymentsQuery',
    options: () => ({
      variables: { status: 'active' }
    })
  }),

  graphql<Props, SetPaymentConfigMutationResponse>(
    gql(mutations.setPaymentConfig),
    {
      name: 'setPaymentConfig'
    }
  ),
  graphql<Props, PaymentConfigQueryResponse>(gql(queries.paymentConfigQuery), {
    name: 'paymentConfigQuery',
    skip: props => !props.contentType || !props.contentTypeId,
    options: ({ contentType, contentTypeId }) => ({
      variables: {
        contentType,
        contentTypeId
      }
    })
  })
)(SelectPaymentsContainer);
