import React from 'react';
import * as compose from 'lodash.flowright';
import { withProps } from '@erxes/ui/src/utils/core';
import List from '../components/List';
import { queries as groupQueries } from '../group/graphql';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { mutations, queries } from '../graphql';
import { Alert, Bulk, confirm, Spinner } from '@erxes/ui/src';
import {
  AssetRemoveMutationResponse,
  IAssetDetailQueryResponse,
  IAssetGroupDetailQueryResponse,
  IAssetQueryResponse,
  IAssetTotalCountQueryResponse,
  MergeMutationResponse
} from '../../common/types';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';

import { getRefetchQueries } from '../../common/utils';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};
type FinalProps = {
  assets: IAssetQueryResponse;
  assetsCount: IAssetTotalCountQueryResponse;
  assetGroupDetailQuery: IAssetGroupDetailQueryResponse;
  assetDetailQuery: IAssetDetailQueryResponse;
} & Props &
  AssetRemoveMutationResponse &
  MergeMutationResponse;
class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
    this.state = {
      mergeAssetLoading: false
    };

    this.assetList = this.assetList.bind(this);
  }

  remove = ({ assetIds }, emptyBulk) => {
    const { assetsRemove } = this.props;

    assetsRemove({
      variables: { assetIds }
    })
      .then(removeStatus => {
        emptyBulk();

        const status = removeStatus.data.assetsRemove;

        status === 'deleted'
          ? Alert.success('You successfully deleted a asset')
          : Alert.warning('Asset status deleted');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  mergeAssets = ({ ids, data, callback }) => {
    const { assetsMerge, history } = this.props;

    this.setState({ mergeAssetLoading: true });

    assetsMerge({
      variables: {
        assetIds: ids,
        assetFields: data
      }
    })
      .then((result: any) => {
        callback();
        this.setState({ mergeAssetLoading: false });
        Alert.success('You successfully merged a asset');
        history.push(`/settings/asset-movements/details/${result.data.assetsMerge._id}`);
      })
      .catch(e => {
        Alert.error(e.message);
        this.setState({ mergeAssetLoading: false });
      });
  };

  assetList(props) {
    const {
      assets,
      assetsCount,
      queryParams,
      assetGroupDetailQuery,
      assetDetailQuery
    } = this.props;
    if (assets.loading) {
      return <Spinner />;
    }

    const updatedProps = {
      ...this.props,
      assets: assets?.assets,
      assetsCount: assetsCount.assetsCount,
      remove: this.remove,
      mergeAssets: this.mergeAssets,
      loading: assets.loading,
      queryParams,
      currentGroup: assetGroupDetailQuery.assetGroupDetail || {},
      currentParent: assetDetailQuery.assetDetail || {},
      searchValue: queryParams.searchValue || ''
    };

    return <List {...props} {...updatedProps} />;
  }

  render() {
    const refetch = () => {
      this.props.assets.refetch();
    };

    return <Bulk content={this.assetList} refetch={refetch} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.assets), {
      name: 'assets',
      options: ({ queryParams }) => ({
        variables: {
          groupId: queryParams?.groupId,
          parentId: queryParams?.parentId,
          searchValue: queryParams?.searchValue,
          type: queryParams?.type,
          ...generatePaginationParams(queryParams || {})
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql(gql(queries.assetsCount), {
      name: 'assetsCount'
    }),
    graphql<Props>(gql(queries.assetDetail), {
      name: 'assetDetailQuery',
      options: ({ queryParams }) => ({
        variables: {
          _id: queryParams?.parentId
        }
      })
    }),
    graphql<Props>(gql(groupQueries.assetGroupDetail), {
      name: 'assetGroupDetailQuery',
      options: ({ queryParams }) => ({
        variables: {
          _id: queryParams?.groupId
        }
      })
    }),
    graphql(gql(mutations.assetsMerge), {
      name: 'assetsMerge'
    }),
    graphql(gql(mutations.assetsRemove), {
      name: 'assetsRemove',
      options: () => ({
        refetchQueries: getRefetchQueries()
      })
    })
  )(ListContainer)
);
