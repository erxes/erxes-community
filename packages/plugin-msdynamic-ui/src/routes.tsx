import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const GeneralSettings = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Msdynamics" */ './containers/GeneralSettings'
  )
);

const msdynamics = ({ history }) => {
  return <GeneralSettings history={history} />;
};

const routes = () => {
  return <Route path="/msdynamics/" component={msdynamics} />;
};

export default routes;
