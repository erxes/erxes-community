import * as dayjs from 'dayjs';
import { FormControl } from '@erxes/ui/src/components/form';
import Tip from '@erxes/ui/src/components/Tip';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';

type Props = {
  category: any;
  history: any;
};

class ErkhetRow extends React.Component<Props> {
  render() {
    const { category } = this.props;

    const onClick = e => {
      e.stopPropagation();
    };

    const onTrClick = () => {};

    const { name, code, order, parent } = category;

    return (
      <tr onClick={onTrClick}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{parent}</td>
        <td>{order}</td>
      </tr>
    );
  }
}

export default ErkhetRow;
