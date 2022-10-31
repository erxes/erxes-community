import { ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps, IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import { refetchQueries } from '../common/utils';
import Form from '../components/Form';
import { mutations } from '../graphql';

type Props = {
  queryParams: IQueryParams;
  closeModal: () => void;
} & IRouterProps;

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const renderButton = ({ text, values, isSubmitted, callback, object }: IButtonMutateProps) => {
      let mutation = mutations.operationAdd;

      return (
        <ButtonMutate
          mutation={mutation}
          variables={values}
          callback={callback}
          refetchQueries={refetchQueries(this.props.queryParams)}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${text}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(FormContainer));
