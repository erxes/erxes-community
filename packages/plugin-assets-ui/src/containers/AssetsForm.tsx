import { ButtonMutate, withProps } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import AssetsForm from '../components/AssetsForm';
import { mutations, queries } from '../graphql';
import {
  AssetCategoriesQueryResponse,
  AssetsQueryResponse,
  IAssets
} from '../types';

type Props = {
  queryParams: any;
  assets: IAssets[];
  saveMatch: () => void;
  closeModal: () => void;
  assetCategoriesQuery: AssetCategoriesQueryResponse;
};

class FormContainer extends React.Component<Props> {
  render() {
    const { assetCategoriesQuery, closeModal } = this.props;

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
      const afterSave = _data => {
        closeModal();
      };

      return (
        <ButtonMutate
          mutation={object ? mutations.assetsEdit : mutations.assetsAdd}
          variables={values}
          callback={afterSave}
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

    return <AssetsForm {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assets'];
};

export default withProps<Props>(
  compose(
    graphql<Props, AssetCategoriesQueryResponse>(
      gql(queries.assetsCategories),
      {
        name: 'assetCategoriesQuery'
      }
    )
  )(FormContainer)
);
