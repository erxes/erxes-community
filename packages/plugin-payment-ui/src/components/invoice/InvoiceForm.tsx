import Box from '@erxes/ui/src/components/Box';
import Button from '@erxes/ui/src/components/Button';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Icon from '@erxes/ui/src/components/Icon';
import Label from '@erxes/ui/src/components/Label';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Table from '@erxes/ui/src/components/table';
import Tip from '@erxes/ui/src/components/Tip';
import { SectionBodyItem } from '@erxes/ui/src/layout/styles';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils/core';
import React, { useState } from 'react';

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

  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

const InvoiceForm = (props: Props) => {
  const { invoice } = props;

  const [amount, setAmount] = useState(invoice ? invoice.amount : 0);

  const generateDoc = () => {
    const finalValues: any = {};

    if (invoice) {
      finalValues._id = invoice._id;
    }

    // finalValues.name = name;

    return {
      ...finalValues
    };
  };

  const onChangeInput = e => {
    const { id, value } = e.target;
  };

  const renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton } = props;
    const { isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <p>station name or place name</p>
          <FormControl
            {...formProps}
            id="amount"
            name="amount"
            type="number"
            required={true}
            defaultValue={amount}
            onChange={onChangeInput}
          />
        </FormGroup>
        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Close
          </Button>

          {renderButton({
            passedName: 'invoices',
            values: generateDoc(),
            isSubmitted,
            callback: closeModal,
            object: invoice
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default InvoiceForm;
