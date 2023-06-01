import Button from '@erxes/ui/src/components/Button';
import { ControlLabel, Form, FormControl } from '@erxes/ui/src/components/form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IFormProps } from '@erxes/ui/src/types';
import React, { useState } from 'react';

import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import List from './List';
import { __, loadDynamicComponent } from '@erxes/ui/src/utils/core';

type Props = {
  addresses: IAddress[];
  closeModal?: () => void;
  onSave: (addresses: IAddress[]) => void;
  //   renderButton: (props: IButtonMutateProps) => JSX.Element;
  modal?: boolean;
};

const AddressesEdit = (props: Props) => {
  const { closeModal } = props;

  const [currentAddress, setCurrentAddress] = useState<IAddress | undefined>(
    props.addresses.find(address => address.isPrimary)
  );

  console.log('currentAddress', currentAddress);

  const onChangeAddresses = (addresses: IAddress[]) => {
    // const winner = addresses.filter((p) => p.status === 'won');
    // if (!winner.length) {
    //   return;
    // }
    // setSelectedParticipant(winner[0]);
  };

  const onSelectRow = (address: IAddress) => {
    setCurrentAddress(address);
  };

  const renderFooter = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    const onSubmit = async () => {
      props.onSave(values);
    };

    return (
      <ModalFooter>
        <Button
          btnStyle="simple"
          type="button"
          icon="times-circle"
          onClick={closeModal}
        >
          Cancel
        </Button>

        <Button
          btnStyle="success"
          type="submit"
          disabled={isSubmitted}
          icon="check"
          onClick={onSubmit}
        >
          {isSubmitted ? 'Saving...' : 'Save'}
        </Button>
      </ModalFooter>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    const onChangeMarker = marker => {
      console.log('onChangeMarker', marker);
    };

    const mapProps = {
      id: `contactAddressMap`,
      width: '100%',
      height: '300px',
      zoom: 15,
      markers: [
        currentAddress && {
          position: { lat: currentAddress.lat, lng: currentAddress.lng }
        }
      ],
      center: currentAddress && {
        lat: currentAddress.lat,
        lng: currentAddress.lng
      },
      autoCenter: true,
      editable: true,
      onChangeMarker
    };

    return (
      <>
        <FormGroup>
          <List
            addresses={props.addresses}
            currentAddress={currentAddress}
            onChange={onChangeAddresses}
            onSelect={onSelectRow}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Address</ControlLabel>
          <FormControl
            name="address"
            value={currentAddress?.short || ''}
            // onChange={}
            placeholder="Address"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Location</ControlLabel>
          <p>{__('Please mark the location on the map')}</p>
          {loadDynamicComponent('osMap', mapProps)}
        </FormGroup>

        {renderFooter({ ...formProps })}
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default AddressesEdit;
