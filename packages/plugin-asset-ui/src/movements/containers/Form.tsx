import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import Form from '../components/Form';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries as assetQueries } from '../../asset/graphql';
import { IAsset, IAssetQueryResponse } from '../../common/types';
import { Spinner } from '@erxes/ui/src';

type Props = {
  assets: IAssetQueryResponse;
};

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { assets } = this.props;

    if (assets.loading) {
      return <Spinner objective />;
    }

    const refetch = variables => {
      assets.refetch(variables);
    };

    const updatedProps = {
      assets: assets.assets,
      loading: assets.loading,
      refetch
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
