import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import EmptyContent from '@erxes/ui/src/components/empty/EmptyContent';
import Table from '@erxes/ui/src/components/table';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { IKhanbankStatement } from '../types';
import Row from './Row';

type Props = {
  statement: IKhanbankStatement;
  queryParams: any;
  loading: boolean;
  refetch?: () => void;
};

const List = (props: Props) => {
  const { queryParams, loading, statement } = props;
  const totalCount =
    (statement && statement.total && statement.total.count) || 0;

  const renderRow = () => {
    const transactions = (statement && statement.transactions) || [];
    return transactions.map(transaction => (
      <Row key={transaction.record} transaction={transaction} />
    ));
  };

  queryParams.loadingMainQuery = loading;

  const content = (
    <Table whiteSpace="nowrap" hover={true}>
      <thead>
        <tr>
          <th>{__('name')}</th>
          <th>{__('Action')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  console.log('loading', loading);

  return (
    <>
      <DataWithLoader
        data={content}
        loading={loading}
        count={totalCount}
        emptyContent={
          <EmptyContent
            content={{
              title: __('No data found'),
              steps: []
            }}
            maxItemWidth="360px"
          />
        }
      />
    </>
  );
};

export default List;
