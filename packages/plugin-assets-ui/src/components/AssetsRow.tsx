import { FormControl } from '@erxes/ui/src/components/form';
import Icon from '@erxes/ui/src/components/Icon';
import Tip from '@erxes/ui/src/components/Tip';
import colors from '@erxes/ui/src/styles/colors';
import { formatValue } from '@erxes/ui/src/utils';
import React from 'react';
import { IAssets } from '../types';

type Props = {
  assets: IAssets;
  history: any;
  isChecked: boolean;
  toggleBulk: (car: IAssets, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  render() {
    const { assets, history, isChecked, toggleBulk } = this.props;

    const onClick = e => {
      e.stopPropagation();
    };

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(assets, e.target.checked);
      }
    };
    const onTrClick = () => {
      history.push(`/asset/details/${assets._id}`);
    };

    const { name, code, unitPrice, usedAt } = assets;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{name}</td>
        <td>{code}</td>
        <td>{unitPrice}</td>
        <td>{usedAt}</td>
      </tr>
    );
  }
}

export default Row;
