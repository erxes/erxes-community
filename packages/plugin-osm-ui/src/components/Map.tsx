import 'leaflet/dist/leaflet.css';
import '../fullscreen/Leaflet.fullscreen';
import '../fullscreen/leaflet.fullscreen.css';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Leaflet from 'leaflet';

import { Alert } from '@erxes/ui/src/utils';

import { Coordinate } from '../types';
import { __ } from '@erxes/ui/src/utils/core';

type Props = {
  id: string;
  width?: string;
  height?: string;
  zoom?: number;
  markers?: any[];
  center?: Coordinate;

  onAddMarker?: (marker: any) => void;
  onChangeCenter?: (position: any) => void;
  onChangeZoom?: (zoomLevel: number) => void;
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
  const [center, setCenter] = useState(props.center || { lat: 0, lng: 0 });

  useEffect(() => {
    if (props.center) {
      setCenter(props.center);
    }
  }, [center]);

  const eventHandlers = {
    dragend: e => {
      const { lat, lng } = e.target.getLatLng();

      if (props.onChangeCenter) {
        props.onChangeCenter({ lat, lng });
      }
    }
  };

  const markerHtmlStyles = `
width: 30px;
height: 30px;
border-radius: 50% 50% 50% 0;
background: #ff0000;
position: absolute;
transform: rotate(-45deg);
left: 50%;
top: 50%;
margin: -20px 0 0 -20px;`;

  const icon = Leaflet.divIcon({
    className: 'my-custom-pin',
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<div style="${markerHtmlStyles}" />`
  });

  return (
    <MapContainer
      id={id}
      center={center || [47.919481, 106.904299]}
      zoom={zoom || 10}
      zoomControl={true}
      style={{ height, width, zIndex: 0 }}
    >
      {markers.map((marker, index) => (
        <Marker
          icon={icon}
          key={index}
          position={marker.position}
          draggable={marker.draggable}
          eventHandlers={eventHandlers}
          title={marker.id}
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
    </MapContainer>
  );
};

export default Map;
