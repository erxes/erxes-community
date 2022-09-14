import { FormControl } from '@erxes/ui/src/components/form';
import React from 'react';

type Props = {
  category: any;
  history: any;
  isChecked: boolean;
  //   isUnsynced: boolean;
  toggleBulk: (category: any, isChecked?: boolean) => void;
  // toSync: (categoryIds: string[]) => void;
};

class Row extends React.Component<Props> {
  render() {
    const { category, toggleBulk, isChecked } = this.props;
    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(category, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    // const onClickSync = e => {
    //   e.stopPropagation();
    //   this.props.toSync([category._id]);
    // };

    const onTrClick = () => {};

    const { name, code, order, productCount, status } = category;

    return (
      <tr onClick={onTrClick}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{order}</td>
        <td>{productCount}</td>
        <td>{status}</td>
      </tr>
    );
  }
}

export default Row;
