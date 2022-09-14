import { Title } from '@erxes/ui-settings/src/styles';
import { Pagination } from '@erxes/ui/src/components';
import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { router, __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import StatusFilter from '../StatusFilter';
import Row from './InventoryCategoryRow';

type Props = {
  loading: boolean;
  categories: any[];
  history: any;
  queryParams: any;
  isAllSelected: boolean;
  bulk: any[];
  toggleBulk: () => void;
  emptyBulk: () => void;
  toggleAll: (targets: any[], containerId: string) => void;
  toCheckCategories: (categoryCodes: string[]) => void;
  items: any;
};

type State = {};

export const menuPos = [
  { title: 'Check deals', link: '/check-synced-deals' },
  { title: 'Check orders', link: '/check-pos-orders' },
  { title: 'Check Category', link: '/inventory-category' },
  { title: 'Check Products', link: '/inventory-products' }
];

class InventoryCategory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  renderRow = () => {
    const { categories, toggleBulk, bulk } = this.props;
    return categories.map(category => (
      <Row
        history={history}
        key={category._id}
        category={category}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(category)}
      />
    ));
  };

  onChange = () => {
    const { toggleAll, categories } = this.props;
    toggleAll(categories, 'categories');
  };

  renderTable = () => {
    const onClickCheck = () => {
      const codes = this.props.categories.map(c => c.code);
      this.props.toCheckCategories(codes);
    };
    const syncButton = (
      <>
        <Button
          btnStyle="warning"
          size="small"
          icon="check-1"
          onClick={onClickCheck}
        >
          Check
        </Button>
      </>
    );
    const header = (
      <Wrapper.ActionBar
        left={<Title>Product Categories</Title>}
        right={syncButton}
      />
    );
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
              <th>{__('Order')}</th>
              <th>{__('Product count')}</th>
              <th>{__('status')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );
  };
  render() {
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Check category`)}
            queryParams={this.props.queryParams}
            submenu={menuPos}
          />
        }
        leftSidebar={<StatusFilter items={this.props.items || ({} as any)} />}
        content={
          <DataWithLoader
            data={this.renderTable()}
            loading={this.props.loading}
          />
        }
        hasBorder
        footer={<Pagination count={this.props.categories.length} />}
      />
    );
  }
}

export default InventoryCategory;
