import 'leaflet/dist/leaflet.css';
import '../fullscreen/Leaflet.fullscreen';
import '../fullscreen/leaflet.fullscreen.css';

import { Spinner } from '@erxes/ui/src/components';

import Leaflet from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { Coordinate } from '../types';
import FullscreenControl from './FullscreenControl';
import RelocateControl from './RelocateControl';

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

const Map = (props: Props) => {
  console.log('Map', props);
  const { id, zoom, width = '100%', height = '100%' } = props;
  const [markers, setMarkers] = React.useState<any[]>(props.markers || []);
  const [center, setCenter] = useState(props.center);
  const [isReady, setIsReady] = useState(false);
  const mapRef: any = useRef(null);
  const markerRefs: any = useRef([]);

  useEffect(() => {
    if (props.center) {
      setCenter(props.center);
    }

    if (props.markers && isReady) {
      setMarkers(props.markers);
      loadMarkers();
    }

    if (props.autoCenter) {
      autoCenter();
    }

    // if (isReady) {
    //   loadMarkers();
    // }
  }, [isReady, props.center, props.markers]);

  const eventHandlers = {
    dragend: e => {
      const { lat, lng } = e.target.getLatLng();

      if (props.onChangeCenter) {
        props.onChangeCenter({ lat, lng });
      }

      if (mapRef && mapRef.current) {
        mapRef.current.setView([lat, lng], props.zoom || 10);
      }

      if (props.onChangeMarker) {
        const currentMarkerIndex = markerRefs.current.findIndex(
          m => m._leaflet_id === e.target._leaflet_id
        );

        if (currentMarkerIndex === -1) {
          return;
        }

        const marker = markers[currentMarkerIndex];
        marker.position = { lat, lng };

        props.onChangeMarker(marker, currentMarkerIndex);
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

      // console.log('center default', { lat, lng });
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

    if (mapRef && mapRef.current) {
      mapRef.current.setView([lat, lng], props.zoom || 10);
    }
  };

  const loadMarkers = () => {
    console.log('loadMarkers');
    if (mapRef && mapRef.current) {
      mapRef.current.eachLayer(layer => {
        if (layer instanceof Leaflet.Marker) {
          layer.remove();
        }
      });
    }

    markerRefs.current = [];
    console.log('prev markers cleared', markers);
    for (const marker of markers) {
      console.log('marker', marker);
      const iconAttrs: any = {
        shadowUrl:
          'https://erxesmn.s3.amazonaws.com/openstreetmap/leaflet-markers/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      };

      const defaultIcon = new Leaflet.Icon({
        iconUrl:
          'https://erxesmn.s3.amazonaws.com/openstreetmap/leaflet-markers/marker-icon.png',
        ...iconAttrs
      });

      const myMarker = new Leaflet.Marker(marker.position, {
        draggable: props.editable,
        icon: defaultIcon
      });

      if (marker.selected) {
        const selectedIcon = new Leaflet.Icon({
          iconUrl:
            'https://erxesmn.s3.amazonaws.com/openstreetmap/leaflet-markers/marker-icon-red.png',
          ...iconAttrs
        });

        myMarker.setIcon(selectedIcon);
      }

      myMarker.bindPopup(marker.name);

      myMarker.on('dragend', eventHandlers.dragend);

      myMarker.addTo(mapRef.current);
      markerRefs.current.push(myMarker);
      console.log('****** ', markerRefs.current);
    }
  };

  // if (!isReady) {
  //   return <Spinner />;
  // }

  return (
    <MapContainer
      id={id}
      ref={mapRef}
      center={center || [0, 0]}
      zoom={zoom || 10}
      zoomControl={true}
      style={{ height, width, zIndex: 0 }}
      whenReady={() => {
        setIsReady(true);
      }}
    >
      {!isReady && <Spinner />}
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
