import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Assets" */ './containers/List')
);

const assets = ({ history }) => {
  return <List history={history} />;
};

const routes = () => {
  return <Route path="/assets/" component={assets} />;
};

export default routes;
