import React from 'react';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Bulk, withProps } from '@erxes/ui/src';
import List from '../components/List';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

type FinalProps = {} & Props;

class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  renderContent(props) {
    const updatedProps = {
      ...this.props,
      ...props
    };

    return <List {...updatedProps} />;
  }

  render() {
    return <Bulk content={this.renderContent} />;
  }
}

export default withProps<Props>(compose()(ListContainer));
