import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';

const RCFAList = asyncComponent(() =>
  import(/* webpackChunkName: "List - RCFA" */ './rcfa/containers/List')
);

const rcfa = ({ history, location }) => {
  return (
    <RCFAList
      history={history}
      queryParams={queryString.parse(location.search)}
    />
  );
};

const routes = () => {
  return (
    <React.Fragment>
      <Route path="/rcfa" exact component={rcfa} />
    </React.Fragment>
  );
};

export default routes;
