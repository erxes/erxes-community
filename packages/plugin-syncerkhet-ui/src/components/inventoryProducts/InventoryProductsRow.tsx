import * as dayjs from 'dayjs';
import { FormControl } from '@erxes/ui/src/components/form';
import Tip from '@erxes/ui/src/components/Tip';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';

type Props = {
  product: any;
  history: any;
  //   isChecked: boolean;
  //   isUnsynced: boolean;
  //   toggleBulk: (deal: any, isChecked?: boolean) => void;
  //   toSync: (dealIds: string[]) => void;
  //   syncedInfo: any;
};

class Row extends React.Component<Props> {
  render() {
    // const { deal, toggleBulk, isChecked, isUnsynced, syncedInfo } = this.props;
    const { product } = this.props;
    // const onChange = e => {
    //   if (toggleBulk) {
    //     toggleBulk(deal, e.target.checked); //   }
    // };

    const onClick = e => {
      e.stopPropagation();
    };

    // const onClickSync = e => {
    //   e.stopPropagation();
    //   this.props.toSync([deal._id]);
    // };

    const onTrClick = () => {};

    const { name, code, type, unitPrice, category, productCount } = product;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl
            checked={false}
            componentClass="checkbox"
            onChange={onTrClick}
          />
        </td>
        <td>{code}</td>
        <td>{name}</td>
        <td>{type}</td>
        <td>{category.code}</td>
        <td>{productCount}</td>
        <td>{unitPrice}</td>
      </tr>
    );
  }
}

export default Row;
