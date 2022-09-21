import AssetsCategoryList from '../components/AssetsCategoryList';
import React from 'react';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { Alert, withProps, confirm, ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { mutations, queries } from '../graphql';
import {
  AssetCategoriesQueryResponse,
  AssetsCategoriesCountQuery,
  AssetsCategoryRemoveMutationResponse
} from '../types';

type Props = {
  queryParams: any;
  history: any;
  // listQuery: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type FinalProps = {
  assetCategoriesQuery: AssetCategoriesQueryResponse;
} & Props &
  AssetsCategoryRemoveMutationResponse;

class AssetCategoryListContainer extends React.Component<FinalProps> {
  render() {
    const { assetCategoriesQuery, assetsCategoryDelete } = this.props;

    const assetCategories = assetCategoriesQuery.assetsCategories || [];

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      const attachment = values.attachment || undefined;

      values.attachment = attachment
        ? { ...attachment, __typename: undefined }
        : null;

      return (
        <ButtonMutate
          mutation={object}
          variables={object}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully ${
            object ? 'updated' : 'added'
          } a ${name}`}
        />
      );
    };

    const remove = assetsId => {
      confirm().then(() => {
        assetsCategoryDelete({
          variables: { _id: assetsId }
        })
          .then(() => {
            assetCategoriesQuery.refetch();

            Alert.success(
              `You successfully deleted a assets & service category`
            );
          })
          .catch(error => {
            Alert.error(error.message);
          });
      });
    };
    const updatedProps = {
      ...this.props,
      remove,
      assetCategories,
      refetch: assetCategoriesQuery.refetch,
      renderButton
    };

    return <AssetsCategoryList {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assetsCategories', 'assets'];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

export default withProps<Props>(
  compose(
    graphql<Props, AssetCategoriesQueryResponse>(
      gql(queries.assetsCategories),
      {
        name: 'assetCategoriesQuery',
        options: {
          fetchPolicy: 'network-only'
        }
      }
    ),
    graphql<Props, AssetsCategoryRemoveMutationResponse, { _id: string }>(
      gql(mutations.assetsCategoryRemove),
      {
        name: 'assetsCategoryDelete'
      }
    )
  )(AssetCategoryListContainer)
);
