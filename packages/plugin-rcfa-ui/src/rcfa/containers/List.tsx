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
  page: number;
  pageSize: number;
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
    let rcfa: any = [];
    let totalCount: number = 0;

    if (!rcfaList.loading) {
      rcfa = rcfaList.rcfaList.list;
      const count = rcfaList.rcfaList.totalCount;
      totalCount = count;
    }

    const updatedProps = {
      queryParams,
      history,
      list: rcfa,
      totalCount
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfaList), {
      name: 'rcfaList',
      options: (props: any) => ({
        variables: {
          mainType: props.mainType,
          searchValue: props.searchValue,
          page: props.page,
          perPage: props.perPage
        }
      })
    })
  )(ListContainer)
);
