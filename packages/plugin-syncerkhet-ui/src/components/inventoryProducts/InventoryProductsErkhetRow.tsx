import * as dayjs from 'dayjs';
import { FormControl } from '@erxes/ui/src/components/form';
import Tip from '@erxes/ui/src/components/Tip';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';

type Props = {
  product: any;
  history: any;
};

class ErkhetRow extends React.Component<Props> {
  render() {
    const { product } = this.props;

    const onClick = e => {
      e.stopPropagation();
    };

    const onTrClick = () => {};

    const { name, code, barcodes, unitPrice, category, weight } = product;

    return (
      <tr onClick={onTrClick}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{category}</td>
        <td>{barcodes}</td>
        <td>{weight}</td>
        <td>{unitPrice}</td>
      </tr>
    );
  }
}

export default ErkhetRow;
