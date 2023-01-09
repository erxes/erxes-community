import React from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
// erxes
import { Alert, confirm } from '@erxes/ui/src/utils';
// local
import { mutations } from '../../graphql';
import RowComponent from '../../components/plan/Row';

type Props = {
  data: any;
};

const RowContainer = (props: Props) => {
  const { data } = props;
  // Hooks
  const [remove] = useMutation(gql(mutations.pricingPlanRemove));
  const [edit] = useMutation(gql(mutations.pricingPlanEdit));

  const planRemove = () => {
    confirm()
      .then(() => {
        remove({
          variables: { id: props.data._id },
          refetchQueries: ['pricingPlans']
        })
          .then(() => {
            Alert.success('Request successful!');
          })
          .catch((error: any) => Alert.error(error.message));
      })
      .catch((error: any) => Alert.error(error.message));
  };

  const handleStatus = (status: string) => {
    confirm()
      .then(() => {
        edit({
          variables: { doc: { _id: data._id, status } },
          refetchQueries: ['plans']
        })
          .then(() => {
            Alert.success('Request successful!');
          })
          .catch((error: any) => Alert.error(error.message));
      })
      .catch((error: any) => Alert.error(error.message));
  };

  return (
    <RowComponent {...props} remove={planRemove} handleStatus={handleStatus} />
  );
};

export default RowContainer;
