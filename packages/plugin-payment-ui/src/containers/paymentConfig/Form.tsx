import { queries as integrationsQueries } from '@erxes/ui-leads/src/graphql';
import { LeadIntegrationsQueryResponse } from '@erxes/ui-leads/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import Spinner from '@erxes/ui/src/components/Spinner';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';

import ConfigForm from '../../components/paymentConfig/Form';
import { mutations, queries } from '../../graphql';
import { getGqlString } from '../utils';

type Props = {
  closeModal: () => void;
  excludeIds?: string[];
};

const FormContainer = (props: Props) => {
  const { data, loading } = useQuery<LeadIntegrationsQueryResponse>(
    gql(integrationsQueries.integrations),
    {
      fetchPolicy: 'network-only',
      variables: {
        kind: 'lead'
      }
    }
  );

  const renderButton = ({
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const mutation = object
      ? mutations.paymentConfigsEdit
      : mutations.paymentConfigsAdd;

    return (
      <ButtonMutate
        mutation={getGqlString(mutation)}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        icon="check-circle"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a config`}
      />
    );
  };

  const integrations = (data && data.integrations) || [];

  if (loading) {
    return <Spinner />;
  }

  const updatedProps = {
    ...props,
    integrations,
    renderButton
  };

  return <ConfigForm {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    {
      query: queries.paymentConfigsQuery
    }
  ];
};

export default FormContainer;
