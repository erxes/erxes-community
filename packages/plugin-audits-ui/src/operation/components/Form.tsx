import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

class Form extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return <>Hello World</>;
  }
}

export default Form;
