import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import List from '../components/List';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
  rcfaList: any;
};

type FinalProps = {} & Props;

class ListContainer extends React.Component<FinalProps> {
  state: {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { queryParams, history, rcfaList } = this.props;
    let rcfa = [];

    if (!rcfaList.loading) {
      rcfa = rcfaList.rcfaList;
    }

    const updatedProps = {
      queryParams,
      history,
      list: rcfa
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfaList), {
      name: 'rcfaList'
    })
  )(ListContainer)
);
