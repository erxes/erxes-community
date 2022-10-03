import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { Bulk } from '@erxes/ui/src';
import List from '../components/List';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {} & IRouterProps;

class ListContainer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderList() {
    const updateProps = {
      ...this.props
    };

    return <List {...updateProps} />;
  }

  render() {
    return <Bulk content={this.renderList} />;
  }
}

export default withProps(compose()(ListContainer));
