import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';
import CarList from './containers/CarsList';
import CarDetails from './containers/detail/CarDetails';
import CarSection from './containers/detail/CarSection';

const details = ({ match }) => {
  const id = match.params.id;
  const type = match.path.split('/')[1];

  if (
    match.path === '/contacts/details/:id' ||
    match.path === '/companies/details/:id'
  ) {
    <CarSection id={id} type={type} />;
  }

  return <CarDetails id={id} />;
};

const list = ({ location, history }) => {
  return (
    <CarList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const routes = () => {
  return (
    <>
      <Route
        key="/erxes-plugin-car/details/:id"
        exact={true}
        path="/erxes-plugin-car/details/:id"
        component={details}
      />
      <Route path="/cars" exact={true} key="/cars" component={list} />
      <Route
        key="/contacts/details/:id"
        exact={true}
        path="/contacts/details/:id"
        component={details}
      />
      <Route
        key="/companies/details/:id"
        exact={true}
        path="/companies/details/:id"
        component={details}
      />
    </>
  );
};

export default routes;
