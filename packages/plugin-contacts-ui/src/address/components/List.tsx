import Table from '@erxes/ui/src/components/table';
import { __ } from '@erxes/ui/src/utils/core';
import React, { useState, useCallback } from 'react';

import Row from './Row';
import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import { FieldStyle, SidebarList } from '@erxes/ui/src/layout/styles';
import { SidebarListItem } from '@erxes/ui-settings/src/styles';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import LeftSidebar from '@erxes/ui/src/layout/components/Sidebar';

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

  const onRemove = () => {
    console.log('remove');
  };

  const renderRow = () => {
    return (addresses || []).map((address, index) => (
      <SidebarListItem
        key={address.osmId}
        isActive={address.osmId === props.currentAddress?.osmId}
      >
        <FieldStyle>
          {address.short}
          <p>{address.short}</p>
        </FieldStyle>

        <ActionButtons>
          <Tip text={__('Delete')} placement="bottom">
            <Button btnStyle="link" onClick={onRemove} icon="cancel-1" />
          </Tip>
        </ActionButtons>
      </SidebarListItem>
    ));

    // return addresses.map((address, index) => (
    //   <Row
    //     key={address.osmId || Math.random().toString()}
    //     address={{
    //       ...address,
    //       isEditing: address.osmId === props.currentAddress?.osmId
    //     }}
    //     index={index}
    //     onChangeCheck={onChangeStatus}
    //     onSelect={props.onSelect}
    //   />
    // ));
  };

  return (
    <LeftSidebar wide={true} hasBorder={true}>
      <SidebarList noTextColor={true} noBackground={true} id={'test'}>
        {renderRow()}
      </SidebarList>
    </LeftSidebar>

    // <Table whiteSpace="nowrap" hover={true}>
    //   <thead>
    //     <tr>
    //       <th>{__('Addresses')}</th>
    //       <th>{__('Default')}</th>
    //     </tr>
    //   </thead>
    //   <tbody>{renderRow()}</tbody>
    // </Table>
  );
};

export default List;
