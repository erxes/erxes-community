import Home from '../components/Home';
import React from 'react';

type Props = {
  queryParams: any;
};

export default function HomeContainer(props: Props) {
  return <Home {...props} />;
}
