import 'leaflet/dist/leaflet.css';
import '../fullscreen/Leaflet.fullscreen';
import '../fullscreen/leaflet.fullscreen.css';

import Leaflet from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import { Alert } from '@erxes/ui/src/utils';

import { __ } from '@erxes/ui/src/utils/core';
import { Coordinate } from '../types';
import { Spinner } from '@erxes/ui/src/components';

type Props = {
  id: string;
  width?: string;
  height?: string;
  zoom?: number;
  markers?: any[];
  center?: Coordinate;
  autoCenter?: boolean;
  editable?: boolean;
  loading?: boolean;

  onChangeCenter?: (position: any) => void;
  onChangeZoom?: (zoomLevel: number) => void;
  onChangeMarker?: (marker: any, index?: number) => void;
};

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    map.addControl(new (Leaflet.Control as any).Fullscreen());
  }, [map]);

  return null;
};

const RelocateControl = props => {
  const map = useMap();
  const controlRef: any = useRef(null);

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          props.setCenter({ lat: latitude, lng: longitude });
          map.setView([latitude, longitude], props.zoom || 10);
        },
        error => {
          Alert.error(__('Error getting user location: ' + error.message));
        }
      );
    } else {
      Alert.error(__('Your browser does not support geolocation'));
    }
  };

  useEffect(() => {
    // Create the control element
    const control: any = new Leaflet.Control({ position: 'topright' });

    // Set up the control when it is added to the map

    const html = '<div"><i class="icon-crosshair"></i></div>';
    control.onAdd = () => {
      const div = Leaflet.DomUtil.create('div', 'leaflet-control-command');
      div.title = 'Relocate';
      div.innerHTML = html;

      Leaflet.DomEvent.disableClickPropagation(div);
      Leaflet.DomEvent.on(div, 'click', handleClick);
      Leaflet.DomEvent.on(div, 'mouseover', () => {
        div.style.backgroundColor = '#f4f4f4';
      });
      Leaflet.DomEvent.on(div, 'mouseout', () => {
        div.style.backgroundColor = '#fff';
      });

      controlRef.current = div;
      return div;
    };

    // Remove the control when it is removed from the map
    control.onRemove = () => {
      Leaflet.DomEvent.off(controlRef.current, 'click', handleClick);
    };

    // Add the control to the map
    control.addTo(map);

    return () => {
      // Remove the control when the component is unmounted
      control.removeFrom(map);
    };
  }, [map]);

  return null; // The control does not render any JSX directly
};

const Map = (props: Props) => {
  const { id, zoom, width = '100%', height = '100%' } = props;
  const [markers, setMarkers] = React.useState<any[]>(props.markers || []);
  const [center, setCenter] = useState(props.center);
  const mapRef: any = useRef(null);

  console.log('Map', props.markers);

  useEffect(() => {
    if (props.center) {
      setCenter(props.center);
    }

    if (props.markers) {
      setMarkers(props.markers);
    }

    if (props.autoCenter) {
      autoCenter();
    }
  }, [props.center, props.markers, markers]);

  const eventHandlers = {
    dragend: e => {
      const { lat, lng } = e.target.getLatLng();

      console.log('dragend', e.target.options);

      if (props.onChangeCenter) {
        props.onChangeCenter({ lat, lng });
      }

      if (mapRef && mapRef.current) {
        mapRef.current.setView([lat, lng], props.zoom || 10);
      }

      if (props.onChangeMarker) {
        const index = Number(e.target.options.alt);
        const marker = markers[index];
        marker.position = { lat, lng };

        props.onChangeMarker(marker, index);
        // console.log('onChangeMarker', index, marker);
      }

      // const index = markers.findIndex((marker) => marker.id === e.target.options.id);
    }
  };

  const autoCenter = () => {
    let lat = 0;
    let lng = 0;

    if (!markers.length && !props.center) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            lat = latitude;
            lng = longitude;
            if (mapRef && mapRef.current) {
              mapRef.current.setView([lat, lng], props.zoom || 10);
            }
          },
          _error => {
            lat = 0;
            lng = 0;
          }
        );
      } else {
        lat = 0;
        lng = 0;
      }

      console.log('center default', { lat, lng });
      return;
    }

    if (markers.length === 1) {
      lat = markers[0].position.lat;
      lng = markers[0].position.lng;
      if (mapRef && mapRef.current) {
        mapRef.current.setView([lat, lng], props.zoom || 10);
      }
      return;
    }

    if (markers.length === 0) {
      return;
    }

    for (const marker of markers) {
      lat += marker.position.lat;
      lng += marker.position.lng;
    }

    lat /= markers.length;
    lng /= markers.length;

    setCenter({ lat, lng });
    console.log('centerrrrr', markers);
    console.log('center', { lat, lng });

    if (mapRef && mapRef.current) {
      mapRef.current.setView([lat, lng], props.zoom || 10);
    }
  };

  return (
    <MapContainer
      id={id}
      ref={mapRef}
      center={center || [0, 0]}
      zoom={zoom || 10}
      zoomControl={true}
      style={{ height, width, zIndex: 0 }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          draggable={props.editable || false}
          eventHandlers={eventHandlers}
          riseOnHover={true}
          riseOffset={250}
          alt={index.toString()}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FullscreenControl />
      <RelocateControl setCenter={setCenter} {...props} />
      {props.loading && <Spinner />}
    </MapContainer>
  );
};

export default Map;
