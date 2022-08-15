import React, { useState } from 'react';
// erxes
import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import FormControl from '@erxes/ui/src/components/form/Control';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Table from '@erxes/ui/src/components/table';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils';
import { IProductCategory } from '@erxes/ui-products/src/types';
import { IRouterProps, IQueryParams } from '@erxes/ui/src/types';
// local
import Row from './Row';
import Sidebar from './Sidebar';
import { SUBMENU } from '../../constants';
// types
import { IRemainderProduct } from '../types';

type Props = {
  history: any;
  queryParams: any;
  products: IRemainderProduct[];
  totalCount: number;
  loading: boolean;
  searchValue: string;
  currentCategory: IProductCategory;
  departmentId: string;
  branchId: string;
  isAllSelected: boolean;
  bulk: any[];
  handleFilter: (filterParams: IQueryParams) => void;
  handleSelect: (values: string[] | string, key: string) => void;
  handleSearch: (event: any) => void;
  isFiltered: () => boolean;
  clearFilter: () => void;
  recalculate: (
    products: any[],
    departmentId: string,
    branchId: string,
    emptyBulk: () => void
  ) => void;
  emptyBulk: () => void;
  toggleBulk: () => void;
  toggleAll: (targets: IRemainderProduct[], containerId: string) => void;
};

export default function List(props: Props) {
  const {
    history,
    queryParams,
    products,
    totalCount,
    loading,
    currentCategory,
    departmentId,
    branchId,
    isAllSelected,
    bulk,
    handleSearch,
    handleSelect,
    handleFilter,
    recalculate,
    emptyBulk,
    toggleBulk,
    toggleAll
  } = props;

  const moveCursorAtTheEnd = (event: any) => {
    const tempValue = event.target.value;

    event.target.value = '';
    event.target.value = tempValue;
  };

  const renderRow = () => {
    return products.map((product: IRemainderProduct) => (
      <Row
        key={product._id}
        product={product}
        isChecked={bulk.includes(product)}
        toggleBulk={toggleBulk}
      />
    ));
  };

  let actionButtons = (
    <FormControl
      type="text"
      placeholder={__('Type to search')}
      onChange={handleSearch}
      defaultValue={queryParams.searchValue}
      autoFocus={true}
      onFocus={moveCursorAtTheEnd}
    />
  );

  if (bulk.length > 0) {
    actionButtons = (
      <Button
        btnStyle="simple"
        size="small"
        icon="tag-alt"
        onClick={() => recalculate(bulk, departmentId, branchId, emptyBulk)}
      >
        {__('Recalculate remainder')}
      </Button>
    );
  }

  const renderContent = (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 60 }}>
            <FormControl
              checked={isAllSelected}
              componentClass="checkbox"
              onChange={() => toggleAll(products, 'products')}
            />
          </th>
          <th>{__('Code')}</th>
          <th>{__('Name')}</th>
          <th>{__('Category')}</th>
          <th>{__('Unit Price')}</th>
          <th>{__('Remainder')}</th>
          <th>{__('UOM')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Remainder of Products')} submenu={SUBMENU} />
      }
      leftSidebar={<Sidebar queryParams={queryParams} history={history} />}
      footer={<Pagination count={totalCount} />}
      content={
        <DataWithLoader
          data={renderContent}
          loading={loading}
          count={totalCount}
          emptyContent={
            <EmptyState
              image="/images/actions/5.svg"
              text="No live remainders"
              size=""
            />
          }
        />
      }
    />
  );
}
