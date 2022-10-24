import Box from '@erxes/ui/src/components/Box';
import Button from '@erxes/ui/src/components/Button';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Form from '@erxes/ui/src/components/form/Form';
import Icon from '@erxes/ui/src/components/Icon';
import Label from '@erxes/ui/src/components/Label';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Table from '@erxes/ui/src/components/table';
import Tip from '@erxes/ui/src/components/Tip';
import { SectionBodyItem } from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import InvoiceForm from '../../containers/invoice/InvoiceForm';

import { IInvoice } from '../../types';

export type Props = {
  invoice?: IInvoice;

  contentTypeId: string;
  contentType: string;
  customerId?: string;
  companyId?: string;
  description?: string;
  phone?: string;
  email?: string;

  closeModal: () => void;
};

export default function Component(props: Props) {
  const editTrigger = (
    <Button btnStyle="link">
      <Tip text={__('create invoice')} placement="top">
        <Icon icon="invoice" />
      </Tip>
    </Button>
  );

  //   const content = props => <div>hello</div>;

  const content = props => {
    return <InvoiceForm {...props} />;
  };

  return (
    <ModalTrigger
      title="Create invoice"
      trigger={editTrigger}
      content={content}
    />
  );
}
