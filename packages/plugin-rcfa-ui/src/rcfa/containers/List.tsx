import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import List from '../components/List';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {} & Props;

class ListContainer extends React.Component<FinalProps> {
  state: {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { queryParams, history } = this.props;

    const updatedProps = {
      queryParams,
      history,
      list: []
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<Props>(compose()(ListContainer));
