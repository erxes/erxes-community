import React from 'react';
import { Link } from 'react-router-dom';
// erxes
import { __ } from '@erxes/ui/src/utils/core';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Button from '@erxes/ui/src/components/Button';
// local

export default function ActionBar() {
  const renderRight = () => (
    <Link to="/pricing/discount/create">
      <Button
        type="button"
        btnStyle="success"
        icon="plus-circle"
        uppercase={false}
      >
        {__('Create a Discount')}
      </Button>
    </Link>
  );

  return <Wrapper.ActionBar right={renderRight()} />;
}
