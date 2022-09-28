import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';

const AssetList = asyncComponent(() => import(/* webpackChunkName: "List - Assets" */ './asset/containers/List'));

const assets = ({ history, location }) => {
  return <AssetList history={history} queryParams={queryString.parse(location.search)} />;
};

const routes = () => {
  return <Route path='/assets/' component={assets} />;
};

export default routes;
