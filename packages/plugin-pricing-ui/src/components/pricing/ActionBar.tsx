import React from 'react';
// erxes
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
// local
import Form from './Form';

export default function ActionBar() {
  const formContent = (formProps: any) => <Form {...formProps} />;

  const formTrigger = (
    <Button
      type="button"
      btnStyle="success"
      icon="plus-circle"
      uppercase={false}
    >
      {__('Create a Discount')}
    </Button>
  );

  const renderRight = () => (
    <>
      <ModalTrigger
        size="lg"
        title={__('Create a Discount')}
        autoOpenKey="showCreateDiscount"
        trigger={formTrigger}
        content={formContent}
        enforceFocus={false}
      />
    </>
  );

  return <Wrapper.ActionBar right={renderRight()} />;
}
