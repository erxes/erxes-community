import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils/core';
import List from '../components/List';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

class ListContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const updatedProps = {
      ...this.props
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(ListContainer));
