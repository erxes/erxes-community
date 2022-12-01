import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "WorkList" */ './containers/List')
);

const ListComponent = ({ location, history }) => {
  return (
    <List queryParams={queryString.parse(location.search)} history={history} />
  );
};

const routes = () => {
  return (
    <>
      <Route
        path="/processes/overallWorks"
        exact={true}
        key="/processes/overallWorks"
        component={ListComponent}
      />
    </>
  );
};

export default routes;
