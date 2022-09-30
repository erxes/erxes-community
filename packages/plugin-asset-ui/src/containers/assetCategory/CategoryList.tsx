import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Alert, confirm, withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import List from '../../components/assetCategory/CategoryList';
import { mutations, queries } from '../../graphql';
import {
  AssetCategoriesCountQueryResponse,
  AssetCategoryRemoveMutationResponse,
  AssetsQueryResponse
} from '../../types';
import { AssetCategoriesQueryResponse } from '@erxes/ui-assets/src/types';
type Props = { history: any; queryParams: any };

type FinalProps = {
  assetCategoriesQuery: AssetCategoriesQueryResponse;
  assetCategoriesCountQuery: AssetCategoriesCountQueryResponse;
  assetsQuery: AssetsQueryResponse;
} & Props &
  AssetCategoryRemoveMutationResponse;
class AssetListContainer extends React.Component<FinalProps> {
  render() {
    const {
      assetCategoriesQuery,
      assetCategoriesCountQuery,
      assetsQuery,
      assetCategoryRemove
    } = this.props;

    const remove = assetId => {
      confirm().then(() => {
        assetCategoryRemove({
          variables: { _id: assetId }
        })
          .then(() => {
            assetCategoriesQuery.refetch();
            assetCategoriesCountQuery.refetch();
            assetsQuery.refetch();

            Alert.success(`You successfully deleted a asset & service category`);
          })
          .catch(error => {
            Alert.error(error.message);
          });
      });
    };

    const assetCategories = assetCategoriesQuery.assetCategories || [];

    const updatedProps = {
      ...this.props,
      remove,
      assetCategories,
      loading: assetCategoriesQuery.loading,
      assetCategoriesCount: assetCategoriesCountQuery.assetCategoriesTotalCount || 0
    };

    return <List {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assetCategories', 'assetCategoriesTotalCount', 'assets'];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

export default withProps<Props>(
  compose(
    graphql<Props, AssetCategoriesQueryResponse, { parentId: string }>(
      gql(queries.assetCategories),
      {
        name: 'assetCategoriesQuery',
        options: ({ queryParams }) => ({
          variables: {
            status: queryParams.status,
            parentId: queryParams.parentId
          },
          refetchQueries: getRefetchQueries(),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, AssetCategoriesCountQueryResponse>(gql(queries.assetCategoriesCount), {
      name: 'assetCategoriesCountQuery'
    }),
    graphql<Props, AssetCategoryRemoveMutationResponse, { _id: string }>(
      gql(mutations.assetCategoryRemove),
      {
        name: 'assetCategoryRemove',
        options
      }
    ),
    graphql<Props, AssetsQueryResponse>(gql(queries.assets), {
      name: 'assetsQuery'
    })
  )(AssetListContainer)
);
