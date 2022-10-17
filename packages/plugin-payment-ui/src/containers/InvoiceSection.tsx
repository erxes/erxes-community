import Spinner from '@erxes/ui/src/components/Spinner';
import React from 'react';
import { useQuery } from 'react-apollo';

import InvoiceSection from '../components/invoice/InvoiceSection';
import { queries } from '../graphql';
import { InvoicesQueryResponse } from '../types';

type Props = {
  dealId: string;
};

function InvoiceSecitonContainer(props: Props) {
  const { dealId } = props;

  const invoicesQuery = useQuery<InvoicesQueryResponse>(queries.invoices, {
    variables: { contentType: 'cards:deals', contentTypeId: dealId },
    fetchPolicy: 'network-only'
  });

  if (invoicesQuery.loading) {
    return <Spinner />;
  }

  const invoices = (invoicesQuery.data && invoicesQuery.data.invoices) || [];

  return <InvoiceSection {...props} invoices={invoices} />;
}

export default ({ id }: { id: string }) => {
  return <InvoiceSecitonContainer dealId={id} />;
};
