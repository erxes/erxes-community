import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import * as compose from 'lodash.flowright';
import List from '../components/List';
type Props = {};

class ListContainer extends React.Component<Props> {
  render() {
    return <List />;
  }
}

export default withProps<Props>(compose()(ListContainer));
