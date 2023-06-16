import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import { ControlLabel, Form, FormControl } from '@erxes/ui/src/components/form';
import { Formgroup } from '@erxes/ui/src/components/form/styles';
import { IFormProps } from '@erxes/ui/src/types';
import { __, loadDynamicComponent } from '@erxes/ui/src/utils/core';
import React, { useState } from 'react';
import List from './List';

type Props = {
  userLocation?: any;
  addresses: IAddress[];
  closeModal: () => void;
  onSave: (addresses: IAddress[]) => void;
  //   renderButton: (props: IButtonMutateProps) => JSX.Element;
  modal?: boolean;
};

const AddressesEdit = (props: Props) => {
  const { closeModal, userLocation } = props;
  const [addresses, setAddresses] = useState(props.addresses || []);

  const [currentAddress, setCurrentAddress] = useState<IAddress | undefined>(
    props.addresses.find(address => address.isPrimary)
  );

  const onChangeAddresses = (updatedAddresses: IAddress[]) => {
    console.log('onChangeAddresses', updatedAddresses);
  };

  const onSelectRow = (address: IAddress) => {
    setCurrentAddress(address);
  };

  const submit = () => {
    console.log('submit');
    props.onSave(addresses);
  };

  const onAddNew = () => {
    const newAddress: any = {
      osmAddress: 'move pin to set address',
      osmId: 'temp',
      lat: userLocation?.lat || 0,
      lng: userLocation?.lng || 0,
      detail: {} as any,
      isPrimary: false
    };

    setAddresses([...addresses, newAddress]);
    setCurrentAddress(newAddress);

    if (userLocation) {
      reverseGeocode(userLocation);
    }
  };

  const reverseGeocode = ({ lat, lng }) => {
    console.log('reverseGeocode', lat, lng);
    console.log('currentAddress', currentAddress);
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

  React.useEffect(() => {
    console.log('useEffect', currentAddress);
  }, [addresses, onAddNew]);

  const addressDetail = () => {
    const getCenter = () => {
      if (currentAddress) {
        return { lat: currentAddress.lat, lng: currentAddress.lng };
      }
      return { lat: userLocation.lat, lng: userLocation.lng };
    };

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

    const markers: any = [];

    if (currentAddress) {
      markers.push({
        position: { lat: currentAddress.lat, lng: currentAddress.lng }
      });
    }

    const mapProps = {
      id: `contactAddress`,
      width: '100%',
      height: '300px',
      zoom: 15,
      center: getCenter(),
      markers,
      editable: true,
      autoCenter: true,
      onChangeMarker
    };

    return (
      <>
        {loadDynamicComponent('osMap', mapProps)}

        {currentAddress && (
          <>
            <Formgroup>
              <ControlLabel>{__('Address')}</ControlLabel>
              <p>{__('Address from Map')}</p>
              <FormControl
                name="osmAddress"
                value={currentAddress?.osmAddress || ''}
                disabled={true}
              />
            </Formgroup>

            <Formgroup>
              <ControlLabel>{__('Address detail')}</ControlLabel>
              <p>{__('house number, door number etc.')}</p>
              <FormControl
                name="address"
                value={currentAddress?.address || ''}
                placeholder="Country, City, Street, House Number, Zip Code etc."
                onChange={(e: any) => {
                  setCurrentAddress({
                    ...currentAddress,
                    address: e.target.value
                  });

                  setAddresses(
                    addresses.map(a => {
                      if (a.osmId === currentAddress.osmId) {
                        return {
                          ...a,
                          address: e.target.value
                        };
                      }
                      return a;
                    })
                  );
                }}
              />
            </Formgroup>
          </>
        )}
      </>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    console.log('renderContent', addresses);
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <List
            onAddNew={onAddNew}
            addresses={addresses}
            currentAddress={currentAddress}
            onChange={onChangeAddresses}
            onSelect={onSelectRow}
            close={closeModal}
            onSave={submit}
          />
        </div>
        <div style={{ width: '60%' }}>{addressDetail()}</div>
      </div>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default AddressesEdit;
