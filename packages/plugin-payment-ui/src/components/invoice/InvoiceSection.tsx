import Box from '@erxes/ui/src/components/Box';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Table from '@erxes/ui/src/components/table';
import { SectionBodyItem } from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { IInvoice } from '../../types';

export type Props = {
  invoices: IInvoice[];
};

export default function Component({ invoices }: Props) {
  const renderBody = (invoices: IInvoice[]) => {
    if (!invoices || !invoices.length) {
      return <EmptyState icon="user-6" text="No data" />;
    }

    return (
      <div>
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Kind')}</th>
              <th>{__('Amount')}</th>
              <th>{__('Status')}</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>{invoice.payment.kind}</td>
                <td>{invoice.amount.toFixed(2)}</td>
                <td>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Box
      title={__('Invoices')}
      //   extraButtons={extraButtons}
      isOpen={true}
      name="invoiceList"
    >
      {renderBody(invoices)}
    </Box>
  );
}
