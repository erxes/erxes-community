import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

const pricing = asyncComponent(() =>
  import(
    /* webpackChunkName: "Settings List - Pricing" */ './components/pricing/Page'
  )
);

const routes = () => {
  return (
    <React.Fragment>
      <Route exact={true} path="/pricing" key="/pricing" component={pricing} />
    </React.Fragment>
  );
};

export default routes;
