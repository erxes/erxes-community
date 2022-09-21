import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Assets" */ './containers/List')
);

const Details = asyncComponent(() =>
  import(/* webpackChunkName: "AssetsDetail" */ './containers/AssetsDetail')
);

const assets = ({ history }) => {
  const queryParams = queryString.parse(location.search);
  return <List history={history} queryParams={queryParams} />;
};

const detail = ({ match }) => {
  const id = match.params.id;

  return <Details id={id} />;
};

const routes = () => {
  return (
    <>
      <Route path="/assets/" component={assets} />;
      <Route path="/asset/details/:id" component={detail} />
    </>
  );
};

export default routes;
