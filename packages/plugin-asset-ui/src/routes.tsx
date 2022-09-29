import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';

const AssetList = asyncComponent(() =>
  import(/* webpackChunkName: "List - Assets" */ './asset/containers/List')
);
const AssetDetails = asyncComponent(() =>
  import(/* webpackChunkName: "List - Assets" */ './asset/detail/containers/Details')
);

const assets = ({ history, location }) => {
  return <AssetList history={history} queryParams={queryString.parse(location.search)} />;
};

const details = ({ history, location, match }) => {
  const id = match.params.id;

  return (
    <AssetDetails history={history} queryParams={queryString.parse(location.search)} id={id} />
  );
};

const routes = () => {
  return (
    <React.Fragment>
      <Route path="/settings/asset-movements/" exact component={assets} />
      <Route
        path="/settings/asset-movements/details/:id"
        exact={true}
        key="/settings/asset-movements/details/:id"
        component={details}
      />
    </React.Fragment>
  );
};

export default routes;
