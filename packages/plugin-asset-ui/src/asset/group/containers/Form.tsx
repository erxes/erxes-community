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
import { IAssetGroupTypes } from '../../../common/types';

type Props = {
  closeModal: () => void;
  refetchAssetGroups: () => void;
  group: IAssetGroupTypes;
  groups: IAssetGroupTypes[];
};

type FinalProps = {} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  renderButton = ({ name, values, isSubmitted, callback, confirmationUpdate, object }: IButtonMutateProps) => {
    const afterMutate = () => {
      if (callback) {
        this.props.refetchAssetGroups();
        callback();
      }
    };

    let mutation = mutations.assetGroupAdd;

    let sucessAction = 'added';

    if (object) {
      mutation = mutations.assetGroupEdit;
      sucessAction = 'updated';
    }

    return (
      <ButtonMutate
        mutation={mutation}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type='submit'
        confirmationUpdate={confirmationUpdate}
        successMessage={`You successfully ${sucessAction} a ${name}`}
      />
    );
  };

  render() {
    const { closeModal, group, groups } = this.props;

    const updatedProps = {
      renderButton: this.renderButton,
      closeModal,
      group,
      groups
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(FormContainer));
