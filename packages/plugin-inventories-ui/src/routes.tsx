import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const remainders = asyncComponent(() =>
  import(
    /* webpackChunkName: 'List - LiveRemainders' */ './remainders/containers/List'
  )
);
const ReserveRems = asyncComponent(() =>
  import(
    /* webpackChunkName: 'List - LiveRemainders' */ './reserveRemainders/containers/List'
  )
);

const safeRemainders = asyncComponent(() =>
  import(
    /* webpackChunkName: 'List - SafeRemainders' */ './safeRemainders/containers/List'
  )
);

const safeRemainderDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: 'List - SafeRemainders' */ './safeRemainderDetails/containers/List'
  )
);

const transactions = asyncComponent(() =>
  import(
    /* webpackChunkName: 'List - Transactions' */ './transactions/containers/List'
  )
);

const reserveRems = ({ location, history }) => {
  return (
    <ReserveRems
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const routes = () => {
  return (
    <>
      <Route
        exact={true}
        path="/inventories/remainders/"
        key="/inventories/remainders/"
        component={remainders}
      />

      <Route
        exact={true}
        path="/inventories/reserve-remainders/"
        key="/inventories/reserve-remainders/"
        component={reserveRems}
      />

      <Route
        exact={true}
        path="/inventories/safe-remainders/"
        key="/inventories/safe-remainders/"
        component={safeRemainders}
      />

      <Route
        exact={true}
        path="/inventories/safe-remainders/details/:id"
        key="/inventories/safe-remainders/details/:id"
        component={safeRemainderDetails}
      />

      <Route
        exact={true}
        path="/inventories/transactions/"
        key="/inventories/transactions"
        component={transactions}
      />
    </>
  );
};

export default routes;
