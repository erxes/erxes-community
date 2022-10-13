import { LeadIntegrationsQueryResponse } from '@erxes/ui-leads/src/types';
import { commonListComposer } from '@erxes/ui/src/utils';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import React from 'react';
import { graphql } from 'react-apollo';
import { Alert, confirm } from '@erxes/ui/src/utils';
import { router } from '@erxes/ui/src';
import List from '../../components/paymentConfig/List';
import { mutations, queries } from '../../graphql';
import {
  PaymentConfigsAddMutationResponse,
  PaymentConfigsCountQueryResponse,
  PaymentConfigsEditMutationResponse,
  PaymentConfigsQueryResponse,
  PaymentConfigsRemoveMutationResponse
} from '../../types';

import { useMutation, useQuery } from 'react-apollo';

const commonOptions = ({ queryParams }: { queryParams?: any }) => ({
  refetchQueries: [
    {
      query: queries.paymentConfigsQuery,
      variables: {
        contentType: queryParams.contentType,
        ...generatePaginationParams(queryParams)
      }
    }
  ]
});

type Props = {
  queryParams: any;
};
export default function ConfigListContainer(props: Props) {
  const { data, loading, refetch } = useQuery<PaymentConfigsQueryResponse>(
    queries.paymentConfigsQuery,
    {
      variables: {
        ...router.generatePaginationParams(props.queryParams || {})
      },
      fetchPolicy: 'network-only'
    }
  );

  const countResponse = useQuery<PaymentConfigsCountQueryResponse>(
    queries.paymentConfigsTotalCount,
    {
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation] = useMutation(mutations.paymentConfigsRemove);

  const remove = (_id: string) => {
    const message = 'Are you sure want to remove this config ?';

    confirm(message).then(() => {
      removeMutation({
        variables: { _id }
      })
        .then(() => {
          refetch();

          Alert.success('You successfully deleted a config.');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  console.log('dddddd ', data);

  const extendedProps = {
    ...props,
    loading,
    configs: data ? data.getPaymentConfigs : [],
    totalCount:
      (countResponse.data && countResponse.data.paymentConfigsTotalCount) || 0,
    refetch,
    remove
  };

  return <List {...extendedProps} />;
}

// export default commonListComposer<Props>({
//   label: 'paymentConfigs',
//   text: 'Payment Config',
//   stringEditMutation: getGqlString(mutations.paymentConfigsEdit),
//   stringAddMutation: getGqlString(mutations.paymentConfigsAdd),

//   confirmProps: {
//     message:
//       'This will permanently delete this config and configs in it. Are you absolutely sure?',
//     options: { hasDeleteConfirm: true },
//   },

//   gqlListQuery: graphql<Props, PaymentConfigsQueryResponse>(
//     queries.paymentConfigsQuery,
//     {
//       name: 'listQuery',
//       options: () => ({
//         notifyOnNetworkStatusChange: true,
//       }),
//     }
//   ),

//   gqlTotalCountQuery: graphql<{}, any>(queries.paymentConfigsTotalCount, {
//     name: 'totalCountQuery',
//   }),

//   gqlAddMutation: graphql<{}, PaymentConfigsAddMutationResponse>(
//     mutations.paymentConfigsAdd,
//     {
//       name: 'addMutation',
//       options: commonOptions,
//     }
//   ),

//   gqlEditMutation: graphql<{}, PaymentConfigsEditMutationResponse>(
//     mutations.paymentConfigsEdit,
//     {
//       name: 'editMutation',
//       options: commonOptions,
//     }
//   ),

//   gqlRemoveMutation: graphql<Props, PaymentConfigsRemoveMutationResponse>(
//     mutations.paymentConfigsRemove,
//     {
//       name: 'removeMutation',
//       options: commonOptions,
//     }
//   ),

//   ListComponent: ConfigListContainer,
// });
