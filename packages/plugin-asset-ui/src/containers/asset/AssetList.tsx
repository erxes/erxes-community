import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import { Alert, withProps } from '@erxes/ui/src/utils';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import React from 'react';
import { graphql } from 'react-apollo';
import List from '../../components/asset/AssetList';
import { mutations, queries } from '../../graphql';
import {
  CategoryDetailQueryResponse,
  MergeMutationResponse,
  MergeMutationVariables,
  AssetRemoveMutationResponse,
  AssetsCountQueryResponse,
  AssetsQueryResponse
} from '../../types';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  assetsQuery: AssetsQueryResponse;
  assetsCountQuery: AssetsCountQueryResponse;
  assetCategoryDetailQuery: CategoryDetailQueryResponse;
} & Props &
  AssetRemoveMutationResponse &
  MergeMutationResponse;

class AssetListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.state = {
      mergeAssetLoading: false
    };
  }

  render() {
    const {
      assetsQuery,
      assetsCountQuery,
      assetsRemove,
      assetsMerge,
      queryParams,
      assetCategoryDetailQuery,
      history
    } = this.props;

    if (assetsQuery.loading) {
      return false;
    }

    const assets = assetsQuery.assets || [];

    // remove action
    const remove = ({ assetIds }, emptyBulk) => {
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

    const mergeAssets = ({ ids, data, callback }) => {
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
          history.push(`/settings/asset-service/details/${result.data.assetsMerge._id}`);
        })
        .catch(e => {
          Alert.error(e.message);
          this.setState({ mergeAssetLoading: false });
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';

    const updatedProps = {
      ...this.props,
      queryParams,
      assets,
      remove,
      loading: assetsQuery.loading,
      searchValue,
      assetsCount: assetsCountQuery.assetsTotalCount || 0,
      currentCategory: assetCategoryDetailQuery.assetCategoryDetail || {},
      mergeAssets
    };

    const assetList = props => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.assetsQuery.refetch();
    };

    return <Bulk content={assetList} refetch={refetch} />;
  }
}

const getRefetchQueries = () => {
  return [
    'assets',
    'assetCategories',
    'assetCategoriesCount',
    'assetsTotalCount',
    'assetCountByTags'
  ];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

export default withProps<Props>(
  compose(
    graphql<Props, AssetsQueryResponse, { page: number; perPage: number }>(gql(queries.assets), {
      name: 'assetsQuery',
      options: ({ queryParams }) => ({
        variables: {
          categoryId: queryParams.categoryId,
          tag: queryParams.tag,
          searchValue: queryParams.searchValue,
          type: queryParams.type,
          ...generatePaginationParams(queryParams)
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, AssetsCountQueryResponse>(gql(queries.assetsCount), {
      name: 'assetsCountQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, AssetRemoveMutationResponse, { assetIds: string[] }>(
      gql(mutations.assetsRemove),
      {
        name: 'assetsRemove',
        options
      }
    ),
    graphql<Props, CategoryDetailQueryResponse>(gql(queries.assetCategoryDetail), {
      name: 'assetCategoryDetailQuery',
      options: ({ queryParams }) => ({
        variables: {
          _id: queryParams.categoryId
        }
      })
    }),
    graphql<Props, MergeMutationResponse, MergeMutationVariables>(gql(mutations.assetsMerge), {
      name: 'assetsMerge'
    })
  )(AssetListContainer)
);
