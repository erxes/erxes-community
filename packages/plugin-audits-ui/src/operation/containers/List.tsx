import { Bulk, withProps } from '@erxes/ui/src';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { OperationsQueryResponse } from '../common/types';
import List from '../components/List';
import { queries } from '../graphql';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

type FinalProps = {
  operations: OperationsQueryResponse;
} & Props;

class ListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
  }

  renderContent(props) {
    const { operations } = this.props;
    const updatedProps = {
      ...this.props,
      ...props,
      list: operations.auditOperations,
      totalCount: operations.auditOperationsTotalCount,
      loading: operations.loading
    };

    return <List {...updatedProps} />;
  }

  render() {
    return <Bulk content={this.renderContent} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.operations), {
      name: 'operations'
    })
  )(ListContainer)
);
