import { Title } from '@erxes/ui-settings/src/styles';
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { VerticalDivider, VLeftSplit, VRightSplit, VSplit } from '../../styles';
import ErxesRow from './InventoryCategoryErxesRow';
import ErkhetRow from './InventoryCategoryErkhetRow';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';

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

  renderErxesRow = () => {
    const { categories, toggleBulk, bulk } = this.props;
    return categories.map(category => (
      <ErxesRow
        history={history}
        key={category._id}
        category={category}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(category)}
      />
    ));
  };

  renderErkhetRow = () => {
    const { erkhetCategories } = this.props;
    return erkhetCategories.map(category => (
      <ErkhetRow history={history} key={category._id} category={category} />
    ));
  };

  onChange = () => {
    const { toggleAll, categories } = this.props;
    toggleAll(categories, 'categories');
  };

  renderErkhetSide = () => {
    const header = (
      <Wrapper.ActionBar left={<Title>Erkhet Product Categories</Title>} />
    );
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
              <th>{__('Parent')}</th>
              <th>{__('Order')}</th>
            </tr>
          </thead>
          <tbody>{this.renderErkhetRow()}</tbody>
        </Table>
      </>
    );
  };

  renderErxesSide = () => {
    const { isAllSelected, bulk } = this.props;
    const syncButton = (
      <>
        {bulk.length > 0 && (
          <Button
            btnStyle="success"
            size="small"
            icon="check-1"
            onClick={() => {}}
          >
            Sync
          </Button>
        )}
      </>
    );
    const header = (
      <Wrapper.ActionBar
        left={<Title>Erxes Product Categories</Title>}
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
          <tbody>{this.renderErxesRow()}</tbody>
        </Table>
      </>
    );
  };
  render() {
    const content = (
      <VSplit>
        <VLeftSplit>{this.renderErxesSide()}</VLeftSplit>
        <VerticalDivider />
        <VRightSplit>{this.renderErkhetSide()}</VRightSplit>
      </VSplit>
    );
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Check category`)}
            queryParams={this.props.queryParams}
            submenu={menuPos}
          />
        }
        content={content}
        // footer={<Pagination count={69} />}
      />
    );
  }
}

export default InventoryCategory;
