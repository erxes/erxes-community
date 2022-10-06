import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import Form from '../components/Form';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries as assetQueries } from '../../asset/graphql';
import { IAsset, IAssetQueryResponse, IMovementDetailQueryResponse } from '../../common/types';
import { Spinner, ButtonMutate } from '@erxes/ui/src';
import { getRefetchQueries } from '../../common/utils';
import { mutations, queries } from '../graphql';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  assetId?: string;
  closeModal: () => void;
};

type FinalProps = {
  assets: IAssetQueryResponse;
  movementDetail: IMovementDetailQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { assets, movementDetail, closeModal } = this.props;

    if (assets.loading || movementDetail.loading) {
      return <Spinner objective />;
    }

    const refetch = variables => {
      assets.refetch(variables);
    };

    const renderButton = ({ name, values, isSubmitted, callback }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={mutations.movementAdd}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${name}`}
        />
      );
    };

    const updatedProps = {
      assets: assets.assets,
      loading: assets.loading,
      detail: movementDetail.assetMovement,
      refetch,
      closeModal,
      renderButton: !movementDetail.assetMovement ? renderButton : undefined
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps(
  compose(
    graphql<Props>(gql(assetQueries.assets), {
      name: 'assets'
    }),
    graphql<Props>(gql(queries.movementDetail), {
      name: 'movementDetail',
      skip: ({ assetId }) => !assetId,
      options: ({ assetId }) => ({
        variables: { _id: assetId }
      })
    })
  )(FormContainer)
);
