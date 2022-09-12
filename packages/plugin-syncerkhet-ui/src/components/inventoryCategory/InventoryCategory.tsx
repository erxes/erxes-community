import { Title } from '@erxes/ui-settings/src/styles';
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { BarItems } from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import Row from './InventoryCategoryRow';

type Props = {
  loading: boolean;
  categories: any[];
  erkhetCategories: any[];
  history: any;
  queryParams: any;
  isAllSelected: boolean;
  bulk: any[];
  toggleBulk: () => void;
  emptyBulk: () => void;
  toggleAll: (targets: any[], containerId: string) => void;
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
    const { isAllSelected, bulk } = this.props;
    const syncButton = (
      <>
        {bulk.length > 0 && (
          <BarItems>
            <Button
              btnStyle="success"
              size="small"
              icon="check-1"
              onClick={() => {}}
            >
              Create
            </Button>
            <Button
              btnStyle="warning"
              size="small"
              icon="check-1"
              onClick={() => {}}
            >
              Update
            </Button>
            <Button
              btnStyle="primary"
              size="small"
              icon="check-1"
              onClick={() => {}}
            >
              Delete
            </Button>
          </BarItems>
        )}
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
              <th style={{ width: 60 }}>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
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
        content={this.renderTable()}
        // footer={<Pagination count={69} />}
      />
    );
  }
}

export default InventoryCategory;
