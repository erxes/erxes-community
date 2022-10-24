import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React, { useState } from 'react';

import { IInvoice } from '../../types';
import SelectPayments from '../../containers/SelectPayments';

type Props = {
  contentTypeId: string;
  contentType: string;
  customerId?: string;
  companyId?: string;
  description?: string;
  phone?: string;
  email?: string;

  invoice?: IInvoice;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

const PlaceForm = (props: Props) => {
  const { invoice } = props;
  const [amount, setAmount] = useState<number>(
    (invoice && invoice.amount) || 0
  );

  const [paymentIds, setPaymentIdes] = useState<string[]>([]);

  const generateDoc = () => {
    const finalValues: any = {};

    if (invoice) {
      finalValues._id = invoice._id;
    }

    finalValues.amount = amount;
    finalValues.contentTypeId = props.contentTypeId;
    finalValues.contentType = props.contentType;
    finalValues.customerId = props.customerId;
    finalValues.companyId = props.companyId;
    finalValues.description = props.description;
    finalValues.phone = props.phone;
    finalValues.email = props.email;
    finalValues.paymentIds = paymentIds;

    console.log(finalValues);

    return {
      ...finalValues
    };
  };

  const onChangeInput = e => {
    const { id, value } = e.target;
    setAmount(Number(value));
  };

  const onChangePayments = (values: string[]) => {
    setPaymentIdes(values);
  };

  const renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton } = props;
    const { isSubmitted } = formProps;

    return (
      <>
        <SelectPayments
          defaultValue={paymentIds}
          description="Select payment methods"
          isRequired={true}
          onChange={onChangePayments}
        />

        <FormGroup>
          <ControlLabel>Amount</ControlLabel>
          <p> please </p>
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

export default PlaceForm;
