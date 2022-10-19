import { ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Form from '../components/Form';
import { mutations, queries } from '../graphql';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import __ from 'lodash';
import { IAssetCategoryTypes } from '../../../common/types';

type Props = {
  closeModal: () => void;
  refetchAssetCategories: () => void;
  category: IAssetCategoryTypes;
  categories: IAssetCategoryTypes[];
};

type FinalProps = {} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  renderButton = ({
    text,
    values,
    isSubmitted,
    callback,
    confirmationUpdate,
    object
  }: IButtonMutateProps) => {
    const afterMutate = () => {
      if (callback) {
        this.props.refetchAssetCategories();
        callback();
      }
    };

    let mutation = mutations.assetCategoryAdd;

    let sucessAction = 'added';

    if (object) {
      mutation = mutations.assetCategoryEdit;
      sucessAction = 'updated';
    }

    return (
      <ButtonMutate
        mutation={mutation}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type="submit"
        confirmationUpdate={confirmationUpdate}
        successMessage={`You successfully ${sucessAction} a ${text}`}
      />
    );
  };

  render() {
    const { closeModal, category, categories } = this.props;

    const updatedProps = {
      renderButton: this.renderButton,
      closeModal,
      category,
      categories
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(FormContainer));
