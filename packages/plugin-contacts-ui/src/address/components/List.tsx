import Table from '@erxes/ui/src/components/table';
import { __ } from '@erxes/ui/src/utils/core';
import React, { useState, useCallback } from 'react';

import Row from './Row';
import { IAddress } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  addresses: IAddress[];
  currentAddress: IAddress | undefined;
  onChange: (addresses: IAddress[]) => void;
  onSelect: (address: IAddress) => void;
};

const List = (props: Props) => {
  const [addresses, setAddresses] = useState(props.addresses || []);

  const onChangeStatus = (index: number, isChecked: boolean) => {
    const updatedAddresses = addresses.map((address, i) => ({
      ...address,
      isPrimary: i === index
    }));
    setAddresses(updatedAddresses);
  };

  const renderRow = () => {
    return addresses.map((address, index) => (
      <Row
        key={address.osmId || Math.random().toString()}
        address={{
          ...address,
          isEditing: address.osmId === props.currentAddress?.osmId
        }}
        index={index}
        onChangeCheck={onChangeStatus}
        onSelect={props.onSelect}
      />
    ));
  };

  return (
    <Table whiteSpace="nowrap" hover={true}>
      <thead>
        <tr>
          <th>{__('Addresses')}</th>
          <th>{__('Default')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );
};

export default List;
