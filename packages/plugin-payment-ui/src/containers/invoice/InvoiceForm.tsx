import React from 'react';

import InvoiceForm from '../../components/invoice/InvoiceForm';

type Props = {
  conversationId: string;
};

function InvoiceFormContainer(props: Props) {
  const { conversationId } = props;

  console.log('conversationId', conversationId);

  const updatedProps = {
    ...props
  };

  return <InvoiceForm {...updatedProps} />;
}

export default ({ id }: { id: string }) => {
  return <InvoiceFormContainer conversationId={id} />;
};
