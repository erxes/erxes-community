import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Table from '@erxes/ui/src/components/table';

type Props = {
  data: any[];
  loading: boolean;
  refetch: () => void;
};

const List = (props: Props) => {
  const { data, loading, refetch } = props;

  const renderRow = () =>
    data.map((item: any, index: number) => <p>Row data</p>);

  const renderTable = () => (
    <Table>
      <thead>
        <tr>
          <th>{__('Name')}</th>
          <th>{__('ID')}</th>
          <th>{__('Status')}</th>
          <th>{__('Created by')}</th>
          <th>{__('Last updated at')}</th>
          <th>{__('Actions')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <DataWithLoader
      loading={loading}
      count={data ? data.length : 0}
      data={renderTable()}
      emptyContent={
        <EmptyState image="/images/actions/5.svg" text="No pricings" size="" />
      }
    />
  );
};

export default List;
