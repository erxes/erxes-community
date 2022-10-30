import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

class List extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Hello World</div>;
  }
}

export default List;
