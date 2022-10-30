import App from './App';
import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';

const RiskAssessment = asyncComponent(() =>
  import(/* webpackChunkName: "List - Riskassessments" */ './riskAssessment/containers/List')
);

const Operations = asyncComponent(() =>
  import(/* webpackChunkName: "List - Riskassessments" */ './operation/containers/List')
);

const riskAssessments = ({ history, location }) => {
  return <RiskAssessment history={history} queryParams={queryString.parse(location.search)} />;
};

const operations = ({ history, location }) => {
  return <Operations history={history} queryParams={queryString.parse(location.search)} />;
};

const routes = () => {
  return (
    <>
      <Route path="/audits" exact component={operations} />
      <Route path="/audits/riskassessments" exact component={riskAssessments} />
    </>
  );
};

export default routes;
