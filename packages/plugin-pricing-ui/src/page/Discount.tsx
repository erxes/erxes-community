import React from 'react';
// erxes
import { __ } from '@erxes/ui/src';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
// local
import List from '../containers/discount/List';
import ActionBar from '../containers/discount/ActionBar';
import { submenu } from '../constants';

const Discount = () => {
  return (
    <Wrapper
      header={<Wrapper.Header title={__('Discount')} submenu={submenu} />}
      content={<List />}
      actionBar={<ActionBar />}
      transparent={true}
      hasBorder
    />
  );
};

export default Discount;
