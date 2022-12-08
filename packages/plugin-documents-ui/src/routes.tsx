import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "Settings - List Document" */ './containers/List')
);

const Form = asyncComponent(() =>
  import(/* webpackChunkName: "Settings - Form Document" */ './containers/Form')
);

const documents = ({ location, history }) => {
  return (
    <List queryParams={queryString.parse(location.search)} history={history} />
  );
};

const documentsCreate = ({ location, history }) => {
  return <Form history={history} />;
};

const routes = () => (
  <>
    <Route path="/settings/documents/" exact={true} component={documents} />
    <Route
      path="/settings/documents/create"
      exact={true}
      component={documentsCreate}
    />
  </>
);

export default routes;
