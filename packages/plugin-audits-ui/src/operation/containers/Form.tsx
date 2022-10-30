import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils/core';
import Form from '../components/Form';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

class FormContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const updatedProps = {
      ...this.props
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(FormContainer));
