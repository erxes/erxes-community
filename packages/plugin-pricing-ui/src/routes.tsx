import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

const discount = asyncComponent(() =>
  import(/* webpackChunkName: "Settings List - Pricing" */ './page/Discount')
);

const discountCreate = asyncComponent(() =>
  import(
    /* webpackChunkName: "Settings List - Pricing - Create Discount" */ './page/DiscountCreate'
  )
);

const routes = () => {
  return (
    <React.Fragment>
      <Route
        exact={true}
        path="/pricing/discount"
        key="/pricing/discount"
        component={discount}
      />

      <Route
        exact={true}
        path="/pricing/discount/create"
        key="/pricing/discount/create"
        component={discountCreate}
      />
    </React.Fragment>
  );
};

export default routes;
