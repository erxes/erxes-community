import React from 'react';
import L from 'leaflet';

const CustomMarker = ({ position, id }) => {
  const markerRef: any = React.useRef(null);

  React.useEffect(() => {
    if (markerRef.current) {
      const marker: any = L.marker(position, { draggable: true });
      marker.addTo(markerRef.current);
      marker.id = id;

      // Add event listeners or perform any custom logic with the marker

      return () => {
        if (markerRef.current) {
          markerRef.current.remove();
        }
      };
    }
  }, [position, id]);

  return <div ref={markerRef} />;
};

export default CustomMarker;
