import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import Form from '../components/Form';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries as assetQueries } from '../../asset/graphql';
import { IAsset, IAssetQueryResponse } from '../../common/types';
import { Spinner, ButtonMutate } from '@erxes/ui/src';
import { getRefetchQueries } from '../../common/utils';
import { mutations } from '../graphql';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  assets: IAssetQueryResponse;
  closeModal: () => void;
};

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { assets, closeModal } = this.props;

    if (assets.loading) {
      return <Spinner objective />;
    }

    const refetch = variables => {
      assets.refetch(variables);
    };

    const renderButton = ({ name, values, isSubmitted, callback, object }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={object ? mutations.movementEdit : mutations.movementAdd}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully ${object ? 'updated' : 'added'} a ${name}`}
        />
      );
    };

    const updatedProps = {
      assets: assets.assets,
      loading: assets.loading,
      refetch,
      closeModal,
      renderButton,
      movements: undefined
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps(
  compose(
    graphql<Props>(gql(assetQueries.assets), {
      name: 'assets'
    })
  )(FormContainer)
);
