import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';
import Settings from './containers/config/Settings';
import Uom from './containers/config/Uoms';
import GeneralSettings from './components/config/GeneralSettings';

const AssetList = asyncComponent(() =>
  import(/* webpackChunkName: "Settings List - AssetService" */ './containers/asset/AssetList')
);

const AssetDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "Settings List - AssetService" */ './containers/asset/detail/AssetDetails'
  )
);

const details = ({ match }) => {
  const id = match.params.id;

  return <AssetDetails id={id} />;
};

const assetService = ({ location, history }) => {
  return <AssetList queryParams={queryString.parse(location.search)} history={history} />;
};

const generalSetting = () => {
  return <Settings component={GeneralSettings} />;
};

const uomManage = () => {
  return <Uom history={history} />;
};

const routes = () => (
  <React.Fragment>
    <Route
      path="/settings/assets/details/:id"
      exact={true}
      key="/settings/assets/details/:id"
      component={details}
    />

    <Route path="/settings/assets/" exact={true} key="/settings/assets/" component={assetService} />

    <Route
      path="/settings/assets-config/"
      exact={true}
      key="/settings/assets-config/"
      component={generalSetting}
    />

    <Route
      path="/settings/uoms-manage/"
      exact={true}
      key="/settings/uoms-manage/"
      component={uomManage}
    />
  </React.Fragment>
);

export default routes;
