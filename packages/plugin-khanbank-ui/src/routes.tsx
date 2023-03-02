import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const ConfigsList = asyncComponent(() =>
  import(/* webpackChunkName: "CityList" */ './modules/configs/containers/List')
);

const configsList = history => {
  const { location } = history;
  const queryParams = queryString.parse(location.search);

  return <ConfigsList queryParams={queryParams} history={history} />;
};

const routes = () => {
  return (
    <>
      <Route path="/settings/khanbank" component={configsList} />
    </>
  );
};

export default routes;
