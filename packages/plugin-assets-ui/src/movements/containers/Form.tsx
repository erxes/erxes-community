import { ButtonMutate, Spinner } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { IMovementDetailQueryResponse, IMovementItem } from '../../common/types';
import { getRefetchQueries } from '../../common/utils';
import Form from '../components/Form';
import { mutations, queries } from '../graphql';
type Props = {
  movementId?: string;
  assetId?: string;
  item?: IMovementItem;
  closeModal: () => void;
  refetch?: () => void;
  refetchTotalCount?: () => void;
};

type FinalProps = {
  movementDetail: IMovementDetailQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { movementDetail, closeModal, assetId, movementId, item } = this.props;

    if (movementDetail && movementDetail.loading) {
      return <Spinner objective />;
    }

    const renderButton = ({ text, values, isSubmitted, callback, object }: IButtonMutateProps) => {
      const afterSavedDb = () => {
        const { refetch, refetchTotalCount } = this.props;

        refetch && refetch();
        refetchTotalCount && refetchTotalCount();
        movementDetail && movementDetail.refetch();
        callback && callback();
      };

      let mutation = mutations.movementAdd;
      if (object) {
        mutation = mutations.movementEdit;
      }

      return (
        <ButtonMutate
          mutation={mutation}
          variables={values}
          callback={afterSavedDb}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${text}`}
        />
      );
    };

    const forceNewItem = {
      items: [item],
      selectedItemIds: [item?._id]
    };

    const updatedProps = {
      detail: item ? forceNewItem : movementDetail?.assetMovement || {},
      closeModal,
      renderButton: renderButton,
      assetId,
      movementId
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps(
  compose(
    graphql<Props>(gql(queries.movementDetail), {
      name: 'movementDetail',
      skip: ({ movementId }) => !movementId,
      options: ({ movementId }) => ({
        variables: { _id: movementId },
        fetchPolicy: 'network-only'
      })
    })
  )(FormContainer)
);
