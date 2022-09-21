import { ButtonMutate, withProps } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import AssetsCategoryForm from '../components/AssetsCategoryForm';
import { mutations, queries } from '../graphql';
import { AssetCategoriesQueryResponse, IAssetCategory } from '../types';

type Props = {
  queryParams: any;
  assetCategories: IAssetCategory[];
  saveMatch: () => void;
};

type FinalProps = {
  assetCategoriesQuery: AssetCategoriesQueryResponse;
} & Props;

class CategoryFormContainer extends React.Component<FinalProps> {
  render() {
    const { assetCategoriesQuery } = this.props;

    if (assetCategoriesQuery.loading) {
      return null;
    }

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={
            object ? mutations.assetsCategoryEdit : mutations.assetsCategoryAdd
          }
          variables={values}
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

    const assetCategories = assetCategoriesQuery.assetsCategories || [];

    const updatedProps = {
      ...this.props,
      renderButton,
      assetCategories
    };

    return <AssetsCategoryForm {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assetsCategories'];
};

export default withProps<FinalProps>(
  compose(
    graphql<Props, AssetCategoriesQueryResponse>(
      gql(queries.assetsCategories),
      {
        name: 'assetCategoriesQuery'
      }
    )
  )(CategoryFormContainer)
);
