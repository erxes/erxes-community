import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import React from 'react';

import InvoiceTrigger from '../../components/invoice/InvoiceTrigger';
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

function InvoiceTriggerContainer(props: Props) {
  const updatedProps = {
    ...props
  };

  return <InvoiceTrigger {...updatedProps} />;
}

export default (props: Props) => {
  return <InvoiceTriggerContainer {...props} />;
};
