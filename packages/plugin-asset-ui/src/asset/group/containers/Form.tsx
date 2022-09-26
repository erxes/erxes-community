import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Form from '../components/Form';

type Props = {};

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return <Form />;
  }
}

export default withProps<Props>(compose()(FormContainer));
