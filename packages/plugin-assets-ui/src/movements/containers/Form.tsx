import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import Form from '../components/Form';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries as assetQueries } from '../../asset/graphql';
import { IAsset, IAssetQueryResponse, IMovementDetailQueryResponse } from '../../common/types';
import { Spinner, ButtonMutate, Alert, confirm } from '@erxes/ui/src';
import { getRefetchQueries } from '../../common/utils';
import { mutations, queries } from '../graphql';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  movementId?: string;
  assetId?: string;
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
    const { movementDetail, closeModal, assetId, movementId } = this.props;

    if (movementDetail && movementDetail.loading) {
      return <Spinner objective />;
    }

    const renderButton = ({ text, values, isSubmitted, callback, object }: IButtonMutateProps) => {
      const afterSavedDb = () => {
        const { refetch, refetchTotalCount } = this.props;

        refetch && refetch();
        refetchTotalCount && refetchTotalCount();
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

    const updatedProps = {
      detail: movementDetail?.assetMovement || {},
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
        variables: { _id: movementId }
      })
    })
  )(FormContainer)
);
