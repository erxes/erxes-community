import React from 'react';
import Map from '../components/Map';
import { Coordinate } from '../types';

type Props = {
  id: string;
  width?: string;
  height?: string;
  zoom?: number;
  markers?: any[];
  addMarkerOnCenter?: boolean;

  center?: Coordinate;

  onChangeCenter?: (position: any) => void;
  onChangeZoom?: (zoomLevel: number) => void;
};

const Container = (props: Props) => {
  console.log('MapContainer', props);
  return <Map {...props} />;
};

export default Container;
