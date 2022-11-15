import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
// erxes
import { Alert } from '@erxes/ui/src/utils';
// local
import { mutations } from '../../graphql';
import FormComponent from '../../components/discount/Form';

const FormContainer = () => {
  // Hooks
  const history = useHistory();
  const [add] = useMutation(gql(mutations.discountAdd));

  const discountAdd = (data: any) => {
    add({ variables: { doc: data } })
      .then(() => {
        Alert.success('Request successful!');
        history.push('/pricing/discounts');
      })
      .catch((error: any) => {
        Alert.error(error.message);
      });
  };

  return <FormComponent add={discountAdd} />;
};

export default FormContainer;
