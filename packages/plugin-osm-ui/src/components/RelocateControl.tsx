import { Alert } from '@erxes/ui/src/utils';
import { __ } from '@erxes/ui/src/utils/core';

import Leaflet from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

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

export default RelocateControl;
