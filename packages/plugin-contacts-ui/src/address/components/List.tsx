import { __ } from '@erxes/ui/src/utils/core';
import React, { useState } from 'react';

import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import { SidebarListItem } from '@erxes/ui-settings/src/styles';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import LeftSidebar from '@erxes/ui/src/layout/components/Sidebar';
import { FieldStyle, SidebarList } from '@erxes/ui/src/layout/styles';
import { TopHeader } from '@erxes/ui/src/styles/main';

type Props = {
  addresses: IAddress[];
  currentAddress: IAddress | undefined;
  onChange: (addresses: IAddress[]) => void;
  onSelect: (address: IAddress) => void;
};

const List = (props: Props) => {
  const [addresses, setAddresses] = useState(props.addresses || []);
  console.log('list addresses', addresses);

  React.useEffect(() => {
    setAddresses(props.addresses);
  }, [props.addresses]);

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
    console.log('renderRow');
    return (addresses || []).map((address, index) => (
      <SidebarListItem
        onClick={() => props.onSelect(address)}
        key={index}
        isActive={address.osmId === props.currentAddress?.osmId}
      >
        <a>
          <FieldStyle>
            {address.osmAddress}
            <p>{address.osmAddress}</p>
          </FieldStyle>
        </a>
        <ActionButtons>
          <Tip text={__('Delete')} placement="bottom">
            <Button btnStyle="link" onClick={onRemove} icon="cancel-1" />
          </Tip>
        </ActionButtons>
      </SidebarListItem>
    ));

    // return addresses.map((address, index) => (
    //   <Row
    //     keaay={address.osmId || Math.random().toString()}
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

  const renderSidebarHeader = () => {
    console.log('renderSidebarHeader');
    return (
      <TopHeader>
        <Button
          btnStyle="success"
          block={true}
          uppercase={false}
          icon="plus-circle"
        >
          Add New Address
        </Button>
      </TopHeader>
    );
  };

  return (
    <LeftSidebar wide={true} hasBorder={true} header={renderSidebarHeader()}>
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
