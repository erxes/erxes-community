import { FormControl } from '@erxes/ui/src';
import moment from 'moment';
import React from 'react';
import { IOperations } from '../common/types';

type Props = {
  operation: IOperations;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { operation } = this.props;
    return (
      <tr>
        <td>
          <FormControl componentClass="checkbox" />
        </td>
        <td>{operation?.name}</td>
        <td>{operation?.code}</td>
        <td>{moment(operation?.createdAt || '').format('YYYY MM DD hh:mm')}</td>
      </tr>
    );
  }
}
export default Row;
