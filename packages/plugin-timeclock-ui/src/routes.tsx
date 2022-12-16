import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Timeclocks" */ './containers/List')
);

const mainContent = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);
  const { startDate, endDate, userIds } = queryParams;
  const routePath = location.pathname.split('/').slice(-1)[0];
  console.log('route', userIds);

  return (
    <List
      queryStartDate={startDate}
      queryEndDate={endDate}
      queryUserIds={userIds || null}
      history={history}
      queryParams={queryParams}
      route={routePath}
    />
  );
};

const routes = () => {
  return (
    <>
      <Route path="/timeclocks/" component={mainContent} />
      {/* <Route path="/timeclocks/config" exact={true} component={config} /> */}
    </>
  );
};

export default routes;
