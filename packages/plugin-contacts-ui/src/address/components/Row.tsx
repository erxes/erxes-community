import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Label from '@erxes/ui/src/components/Label';
import TextInfo from '@erxes/ui/src/components/TextInfo';
import Toggle from '@erxes/ui/src/components/Toggle';
import { renderFullName } from '@erxes/ui/src/utils/core';
import React from 'react';

import { IAddress } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  address: IAddress;
  onChangeCheck: (selectedId: string, isChecked: boolean) => void;
};

class Row extends React.Component<Props> {
  renderAction() {
    const { address, onChangeCheck } = this.props;

    const onChange = e => {
      onChangeCheck(address.osmId, e.target.checked);
    };

    const checked = address.isPrimary;

    return (
      <div>
        <Toggle
          id="toggle"
          onChange={onChange}
          defaultChecked={checked}
          checked={checked}
          icons={{
            checked: <span>Yes</span>,
            unchecked: <span>No</span>
          }}
        />
      </div>
    );
  }

  render() {
    const { address } = this.props;

    return (
      <tr>
        <td>
          <TextInfo ignoreTrans={true}>{address.short}</TextInfo>
        </td>
        <td>
          <TextInfo ignoreTrans={true}>
            {address.isPrimary ? 'Primary' : ''}
          </TextInfo>
        </td>
        <td>
          <ActionButtons>{this.renderAction()}</ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
