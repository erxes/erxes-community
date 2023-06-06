import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';
import rcfaDetail from './rcfa/detail/containers/Detail';

const RCFAList = asyncComponent(() =>
  import(/* webpackChunkName: "List - RCFA" */ './rcfa/containers/List')
);

const RCFADetail = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Detail" */ './rcfa/containers/detail/rcfaDetail'
  )
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
      <Route path="/rcfa/detail/:id" exact component={RCFADetail} />
    </React.Fragment>
  );
};

export default routes;
