import { ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Form from '../components/Form';

type Props = {
  closeModal: () => void;
};

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    confirmationUpdate,
    object
  }: IButtonMutateProps) => {
    const afterMutate = () => {
      if (callback) {
        callback();
      }
    };

    let mutation = '';

    let sucessAction = 'added';

    if (object) {
      mutation = '';
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
    const updatedProps = {
      renderButton: this.renderButton,
      closeModal: this.props.closeModal
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(FormContainer));
