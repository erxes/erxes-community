import Leaflet from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    map.addControl(new (Leaflet.Control as any).Fullscreen());
  }, [map]);

  return null;
};

export default FullscreenControl;
