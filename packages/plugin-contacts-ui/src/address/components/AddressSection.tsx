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

  const [isEditing, setIsEditing] = React.useState(false);

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
  }, []);

  const reverseGeocode = ({ lat, lng, index }) => {
    // nominatim reverse geocoding
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { address } = data;
        const updatedAddress = addresses[index];
        updatedAddress.detail = {
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

        addresses[index] = updatedAddress;
        setAddresses([...addresses]);
      });
  };

  const onChangePrimary = (index: number) => {
    const updatedAddresses = addresses.map((address, i) => ({
      ...address,
      isPrimary: i === index
    }));

    setAddresses(updatedAddresses);
  };

  const renderBody = () => {
    const center = addresses[0] && addresses[0];

    const onChangeMarker = (index: number, marker: any) => {
      addresses[index].lat = marker.position.lat;
      addresses[index].lng = marker.position.lng;
      setAddresses([...addresses]);

      reverseGeocode({ ...marker.position, index });
    };

    const markers = addresses.map(address => {
      return {
        position: { lat: address.lat, lng: address.lng },
        name: address.osmAddress
      };
    });

    const mapProps = {
      id: `contactAddress-${_id}`,
      width: '100%',
      height: '300px',
      zoom: 15,
      center,
      markers,
      autoCenter: true,
      editable: isEditing,
      onChangeMarker,
      loading: !userLocation
    };

    return (
      <>
        {/* {addresses.map((address, index) => (
          <AddressDetail
            key={index}
            onClick={() => {
              // onChangePrimary(index);
            }}
          >
            <SidebarList className="no-link">
              <li>
                <FieldStyle overflow="unset">
                  {__('Address line')} {index + 1}
                </FieldStyle>
                <SidebarCounter nowrap={true}>
                  {address.short || __('No address')}
                </SidebarCounter>
              </li>

              <li>
                <FieldStyle overflow="unset">{__('Default')}</FieldStyle>
                <SidebarCounter>
                  <FormControl
                    componentClass="checkbox"
                    checked={address.isPrimary}
                    onChange={() => {
                      onChangePrimary(index);
                    }}
                  />
                </SidebarCounter>
              </li>
              <Tip text={'Remove Schedule'} placement="top">
                <Button
                  size="small"
                  icon="times-circle"
                  // btnStyle="link"
                  // onClick={() => removeSchedule(scheduleOfMember._id, 'schedule')}
                />
              </Tip>
            </SidebarList>
          </AddressDetail>
        ))} */}
        {loadDynamicComponent('osMap', mapProps)}
      </>
    );
  };

  const onAddMarker = () => {
    const newAddress: IAddress = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      isPrimary: addresses.length === 0,
      detail: {
        countryCode: '',
        country: '',
        postcode: '',
        city: '',
        cityDistrict: '',
        suburb: '',
        road: '',
        street: '',
        building: '',
        houseNumber: '',
        other: ''
      },
      osmAddress: '',
      address: '',
      osmId: `temporary-${Math.random()}`
    };

    setAddresses([...addresses, newAddress]);

    setIsEditing(true);
  };

  const onSave = () => {
    const incomplete = addresses.filter(address =>
      String(address.osmId).startsWith('temporary')
    );
    if (incomplete.length > 0) {
      return Alert.warning('Please complete all addresses');
    }

    props.save(addresses);
    setIsEditing(false);
  };

  const manageContent = formProps => (
    <EditForm
      addresses={addresses}
      onSave={props.save}
      closeModal={formProps.closeModal}
    />
  );

  const extraButtons = (
    <>
      {addresses.length && (
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
      )}
      <button onClick={onAddMarker}>
        <Icon icon="plus-circle" />
      </button>
    </>
  );

  const renderFooter = () => {
    if (!isEditing) {
      return null;
    }

    return (
      <Sidebar.Footer>
        <Button
          btnStyle="simple"
          onClick={() => {
            setIsEditing(false);
            setAddresses(props.addresses);
          }}
          icon="times-circle"
        >
          Discard
        </Button>
        <Button btnStyle="success" icon="check-circle" onClick={onSave}>
          Save
        </Button>
      </Sidebar.Footer>
    );
  };

  return (
    <Box
      title={__('Address')}
      extraButtons={userLocation && extraButtons}
      isOpen={true}
      name="address"
    >
      {renderBody()}
      {renderFooter()}
    </Box>
  );
}
