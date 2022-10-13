import { commonListComposer } from '@erxes/ui/src/utils';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { graphql } from 'react-apollo';

import SkillTypes from '../../components/paymentConfig/IntegrationConfigs';
import { mutations, queries } from '../../graphql';
import {
  PaymentConfigsAddMutationResponse,
  PaymentConfigsEditMutationResponse,
  PaymentConfigsQueryResponse,
  PaymentConfigsRemoveMutationResponse
} from '../../types';

type Props = {
  queryParams: any;
};

const getGqlString = doc => {
  return doc.loc && doc.loc.source.body;
};

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

export default commonListComposer<Props>({
  label: 'paymentConfigs',
  text: 'Payment Config',
  stringEditMutation: getGqlString(mutations.paymentConfigsEdit),
  stringAddMutation: getGqlString(mutations.paymentConfigsAdd),

  confirmProps: {
    message:
      'This will permanently delete this config and configs in it. Are you absolutely sure?',
    options: { hasDeleteConfirm: true }
  },

  gqlListQuery: graphql<Props, PaymentConfigsQueryResponse>(
    queries.paymentConfigsQuery,
    {
      name: 'listQuery',
      options: () => ({
        notifyOnNetworkStatusChange: true
      })
    }
  ),

  // gqlTotalCountQuery: graphql<{}, SkillTypesTotalCountQueryResponse>(
  //   queries.skillTypesTotalCount,
  //   {
  //     name: 'totalCountQuery',
  //   }
  // ),

  gqlAddMutation: graphql<{}, PaymentConfigsAddMutationResponse>(
    mutations.paymentConfigsAdd,
    {
      name: 'addMutation',
      options: commonOptions
    }
  ),

  gqlEditMutation: graphql<{}, PaymentConfigsEditMutationResponse>(
    mutations.paymentConfigsEdit,
    {
      name: 'editMutation',
      options: commonOptions
    }
  ),

  gqlRemoveMutation: graphql<Props, PaymentConfigsRemoveMutationResponse>(
    mutations.paymentConfigsRemove,
    {
      name: 'removeMutation',
      options: commonOptions
    }
  ),

  ListComponent: SkillTypes
});
