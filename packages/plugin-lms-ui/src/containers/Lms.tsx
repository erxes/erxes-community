import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LmsComponent from '../components/Lms';
import Routes from '../routes';
import { router as routerUtils, withProps } from '@erxes/ui/src/utils';
type Props = {
  history: any;
};
const Lms = props => {
  const { history } = props;
  //   useEffect(() => {
  //     routerUtils.setParams(history, {}, true);
  //   }, []);
  return <LmsComponent {...props} />;
};

export default Lms;
