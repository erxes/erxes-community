import { IAddress } from '@erxes/ui-contacts/src/customers/types';
import { ControlLabel, Form, FormControl } from '@erxes/ui/src/components/form';
import { Formgroup } from '@erxes/ui/src/components/form/styles';
import { IFormProps } from '@erxes/ui/src/types';
import { __, loadDynamicComponent } from '@erxes/ui/src/utils/core';
import React, { useState, useMemo, useCallback } from 'react';
import List from './List';
import { AddressDetailWrapper } from '../styles';

type Props = {
  userLocation?: any;
  addresses: IAddress[];
  closeModal: () => void;
  onSave: (addresses: IAddress[]) => void;
};

const AddressesEdit = (props: Props) => {
  const { closeModal, userLocation } = props;
  const [addresses, setAddresses] = useState(props.addresses || []);

  const primary = useMemo(() => addresses.find(address => address.isPrimary), [
    addresses
  ]);

  const [currentAddress, setCurrentAddress] = useState<IAddress | undefined>(
    primary ? primary : addresses[0] && addresses[0]
  );

  const onChangeAddresses = (updatedAddresses: IAddress[]) => {
    if (updatedAddresses.length === 0) {
      setCurrentAddress(undefined);
    } else {
      setCurrentAddress(updatedAddresses[0]);
    }

    setAddresses(updatedAddresses);
  };

  const onSelectRow = useCallback((address: IAddress) => {
    setCurrentAddress(address);
  }, []);

  const submit = useCallback(() => {
    props.onSave(addresses);
    closeModal();
  }, [addresses]);

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
            if (a.osmId === previousOsmId) {
              return updatedAddress;
            }
            return a;
          })
        );
      });
  };

  React.useEffect(() => {
    console.log('useEffect', currentAddress);
  }, []);

  const addressDetail = () => {
    const getCenter = () => {
      console.log(currentAddress?.osmId, 'currentAddress');
      console.log(userLocation, 'userLocation');
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
      markers[0] = {
        position: { lat: currentAddress.lat, lng: currentAddress.lng },
        selected: false
      };
    }

    console.log('center ', getCenter());

    const mapProps = {
      id: `contactAddressDetail`,
      width: '100%',
      height: '300px',
      zoom: 15,
      center: getCenter(),
      markers,
      editable: true,
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

            <Formgroup>
              <ControlLabel>{__('Default')}</ControlLabel>
              <FormControl
                name="isPrimary"
                componentClass="checkbox"
                checked={currentAddress?.isPrimary}
                onChange={(e: any) => {
                  setCurrentAddress({
                    ...currentAddress,
                    isPrimary: e.target.checked
                  });

                  setAddresses(
                    addresses.map(a => {
                      if (a.osmId === currentAddress.osmId) {
                        return {
                          ...a,
                          isPrimary: e.target.checked
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
    return (
      <AddressDetailWrapper>
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
      </AddressDetailWrapper>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default AddressesEdit;
