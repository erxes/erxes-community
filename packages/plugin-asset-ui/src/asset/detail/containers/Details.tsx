import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { IUser } from '@erxes/ui/src/auth/types';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Spinner from '@erxes/ui/src/components/Spinner';
import { withProps } from '@erxes/ui/src/utils';
import {
  IAssetDetailQueryResponse,
  //   AssetsConfigsQueryResponse,
  IAsset
} from '../../../common/types';
import React from 'react';
import { graphql } from 'react-apollo';
import AssetDetails from '../components/Details';
import { queries } from '../../graphql';

type Props = {
  id: string;
};

type FinalProps = {
  assetDetailQuery: IAssetDetailQueryResponse;
  //   assetsConfigsQuery: AssetsConfigsQueryResponse;
  currentUser: IUser;
} & Props;

const AssetDetailsContainer = (props: FinalProps) => {
  const { assetDetailQuery, currentUser } = props;

  if (assetDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!assetDetailQuery.assetDetail) {
    return <EmptyState text="Asset not found" image="/images/actions/24.svg" />;
  }

  const assetDetail = assetDetailQuery.assetDetail || ({} as IAsset);

  const updatedProps = {
    ...props,
    loading: assetDetailQuery.loading,
    asset: assetDetail,
    currentUser
  };

  return <AssetDetails {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, IAssetDetailQueryResponse, { _id: string }>(gql(queries.assetDetail), {
      name: 'assetDetailQuery',
      options: ({ id }) => ({
        variables: {
          _id: id
        }
      })
    })
  )(AssetDetailsContainer)
);
