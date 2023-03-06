import { RowTitle } from '@erxes/ui-engage/src/styles';
import React from 'react';

import { IKhanbankTransactionItem } from '../types';

type Props = {
  transaction: IKhanbankTransactionItem;
};

const Row = (props: Props) => {
  const { transaction } = props;

  return (
    <tr>
      <td key={Math.random()}>
        <RowTitle>{transaction.amount || '-'}</RowTitle>
      </td>
    </tr>
  );
};

export default Row;
