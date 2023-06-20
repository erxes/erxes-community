import Box from '@erxes/ui/src/components/Box';
import Icon from '@erxes/ui/src/components/Icon';
import { __, loadDynamicComponent } from '@erxes/ui/src/utils/core';
import React from 'react';

import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import { Alert } from '@erxes/ui/src/utils';
import EditForm from './EditForm';

export type Props = {
  _id: string;
  type: 'customer' | 'company';
  addresses: IAddress[];
  save: (addresses: IAddress[]) => void;
};

export default function Component(props: Props) {
  const { _id, type } = props;
  const [addresses, setAddresses] = React.useState<IAddress[]>(
    props.addresses || []
  );

  const [userLocation, setUserLocation] = React.useState<any>(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        error => {
          setUserLocation({ lat: 0, lng: 0 });
        }
      );
    } else {
      setUserLocation({ lat: 0, lng: 0 });
    }
  }, [setAddresses]);

  const renderBody = () => {
    const center = addresses[0] && addresses[0];

    const markers = addresses.map(address => {
      return {
        position: { lat: address.lat, lng: address.lng },
        name: address.osmAddress + '\r\n' + address.address,
        selected: address.isPrimary
      };
    });

    const mapProps = {
      id: `contactAddress-${_id}`,
      width: '100%',
      height: '300px',
      zoom: 15,
      center,
      markers,
      fitBounds: true,
      editable: false
    };

    return <>{loadDynamicComponent('osMap', mapProps)}</>;
  };

  const manageContent = formProps => (
    <EditForm
      userLocation={userLocation}
      addresses={addresses}
      onSave={props.save}
      closeModal={formProps.closeModal}
    />
  );

  const extraButtons = (
    <>
      <ModalTrigger
        title="Address"
        size="xl"
        trigger={
          <button>
            <Icon icon="edit-3" />
          </button>
        }
        content={manageContent}
      />
    </>
  );

  return (
    <Box
      title={__('Address')}
      extraButtons={userLocation && extraButtons}
      isOpen={true}
      name="address"
    >
      {renderBody()}
    </Box>
  );
}
