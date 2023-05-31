import Table from '@erxes/ui/src/components/table';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import Row from './Row';
import { IAddress } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  addresses: IAddress[];
  onChange: (addresses: IAddress[]) => void;
};

type State = {
  addresses: IAddress[];
};

class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      addresses: props.addresses || []
    };
  }

  renderRow() {
    const addresses = this.state.addresses;

    const onChangeStatus = (selectedId: string, isChecked: boolean) => {
      const changed = addresses.map(p => {
        if (p.osmId === selectedId) {
          return { ...p, status: p.isPrimary = isChecked };
        }

        return { ...p, isPrimary: false };
      });

      this.props.onChange(changed);
      this.setState({ addresses: changed });
    };

    return addresses.map(address => (
      <Row
        key={address.osmId || Math.random().toString()}
        address={address}
        onChangeCheck={onChangeStatus}
      />
    ));
  }

  render() {
    return (
      <Table whiteSpace="nowrap" hover={true}>
        <thead>
          <tr>
            <th>{__('Address')}</th>
            <th>{__('Primary')}</th>
            <th>{__('Action')}</th>
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </Table>
    );
  }
}

export default List;
