import React from 'react';
// erxes
import { __ } from '@erxes/ui/src/utils/core';
import Table from '@erxes/ui/src/components/table';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import EmptyState from '@erxes/ui/src/components/EmptyState';
// local
import Row from './Row';

type Props = {
  loading: boolean;
  data: any[];
};

const List = (props: Props) => {
  const { loading = false, data = [] } = props;

  const renderRow = () =>
    data.map((item: any, index: number) => <Row key={index} data={item} />);

  const renderTable = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Branch')}</th>
            <th>{__('Department')}</th>
            <th>{__('Content Type')}</th>
            <th>{__('Created at')}</th>
          </tr>
        </thead>
        <tbody>{renderRow()}</tbody>
      </Table>
    );
  };

  return (
    <DataWithLoader
      loading={loading}
      count={data.length}
      data={renderTable()}
      emptyContent={
        <EmptyState
          image="/images/actions/5.svg"
          text="No transactions"
          size=""
        />
      }
    />
  );
};

export default List;
