import React from 'react';
// erxes
import { __ } from '@erxes/ui/src/utils';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
// local
import Form from '../components/discount/Form';
import { submenu } from '../constants';

const DiscountCreate = () => {
  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Create a Discount')} submenu={submenu} />
      }
      content={<Form />}
      transparent={true}
    />
  );
};

export default DiscountCreate;
