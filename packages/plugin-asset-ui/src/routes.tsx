import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const AssetList = asyncComponent(() =>
  import(/* webpackChunkName: "List - Assets" */ './asset/containers/List')
);

const assets = ({ history }) => {
  return <AssetList history={history} />;
};

const routes = () => {
  return <Route path="/assets/" component={assets} />;
};

export default routes;
