import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import React from 'react';

import InvoiceForm from '../../components/invoice/InvoiceForm';
import { mutations } from '../../graphql';

type Props = {
  contentType: string;
  contentTypeId: string;

  customerId?: string;
  companyId?: string;
  description?: string;
  phone?: string;
  email?: string;

  closeModal: () => void;
};

function InvoiceFormContainer(props: Props) {
  const renderButton = ({
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.createInvoice : mutations.createInvoice}
        variables={values}
        callback={callback}
        refetchQueries={[]}
        isSubmitted={isSubmitted}
        type="submit"
        icon="check-circle"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a place`}
      />
    );
  };

  const updatedProps = {
    ...props,
    renderButton
  };

  return <InvoiceForm {...updatedProps} />;
}

export default (props: Props) => {
  return <InvoiceFormContainer {...props} />;
};
