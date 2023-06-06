import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import { ControlLabel, Form, FormControl } from '@erxes/ui/src/components/form';
import { Formgroup } from '@erxes/ui/src/components/form/styles';
import { IFormProps } from '@erxes/ui/src/types';
import { __, loadDynamicComponent } from '@erxes/ui/src/utils/core';
import React, { useState } from 'react';
import List from './List';

type Props = {
  addresses: IAddress[];
  closeModal?: () => void;
  onSave: (addresses: IAddress[]) => void;
  //   renderButton: (props: IButtonMutateProps) => JSX.Element;
  modal?: boolean;
};

const AddressesEdit = (props: Props) => {
  const { closeModal } = props;
  const [addresses, setAddresses] = useState(props.addresses || []);

  const [currentAddress, setCurrentAddress] = useState<IAddress | undefined>(
    props.addresses.find(address => address.isPrimary)
  );

  React.useEffect(() => {
    console.log('useEffect', addresses);
  }, [addresses]);

  const onChangeAddresses = (updatedAddresses: IAddress[]) => {
    console.log('onChangeAddresses', updatedAddresses);
  };

  const onSelectRow = (address: IAddress) => {
    setCurrentAddress(address);
  };

  const reverseGeocode = ({ lat, lng }) => {
    if (!currentAddress) {
      return;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { address } = data;
        // console.log('currentAddress', currentAddress);
        const previousOsmId = currentAddress.osmId;
        const updatedAddress = { ...currentAddress };
        const detail = {
          ...address,
          countryCode: address.country_code,
          cityDistrict: address.city_district,
          houseNumber: address.house_number,
          road: address.road,
          suburb: address.suburb,
          other: address.other
        };
        updatedAddress.osmAddress = data.display_name;
        updatedAddress.osmId = data.osm_id;
        updatedAddress.lat = lat;
        updatedAddress.lng = lng;
        updatedAddress.detail = detail;

        setCurrentAddress(updatedAddress);

        setAddresses(
          addresses.map(a => {
            console.log('a.osmId', a.osmId);
            // console.log('previousOsmId', previousOsmId);
            if (a.osmId === previousOsmId) {
              // console.log('updatedAddress', updatedAddress);
              console.log('new address');
              return updatedAddress;
            }
            console.log('old address');
            return a;
          })
        );

        // console.log('addressessssssssssss', addresses);
      });
  };

  const addressDetail = () => {
    const onChangeMarker = (marker: any) => {
      if (!currentAddress) {
        return;
      }

      setCurrentAddress({
        ...currentAddress,
        lat: marker.position.lat,
        lng: marker.position.lng
      });

      reverseGeocode({ ...marker.position });
    };

    const mapProps = {
      id: `contactAddress`,
      width: '100%',
      height: '300px',
      zoom: 15,
      center: { lat: currentAddress?.lat, lng: currentAddress?.lng },
      markers: [
        currentAddress && {
          position: { lat: currentAddress.lat, lng: currentAddress.lng }
        }
      ],
      editable: true,
      autoCenter: true,
      onChangeMarker
    };

    return (
      <>
        {loadDynamicComponent('osMap', mapProps)}
        <Formgroup>
          <ControlLabel>{__('Address line 1')}</ControlLabel>
          <FormControl
            name="addressLine1"
            value={currentAddress?.osmAddress || ''}
            disabled={true}
          />
        </Formgroup>
      </>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    console.log('renderContent', addresses);
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <List
            addresses={addresses}
            currentAddress={currentAddress}
            onChange={onChangeAddresses}
            onSelect={onSelectRow}
          />
        </div>
        <div style={{ width: '60%' }}>{addressDetail()}</div>
      </div>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default AddressesEdit;
