import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import Table from '@erxes/ui/src/components/table';
import FormControl from '@erxes/ui/src/components/form/Control';
import { VerticalDivider, VLeftSplit, VRightSplit, VSplit } from '../../styles';
import { Title } from '@erxes/ui-settings/src/styles';
import Button from '@erxes/ui/src/components/Button';
import ErxesRow from './InventoryProductsErxesRow';
import ErkhetRow from './InventoryProductsErkhetRow';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';

type Props = {
  loading: boolean;
  products: any[];
  erkhetProducts: any[];
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

class InventoryProducts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  renderErxesRow = () => {
    const { products, toggleBulk, bulk } = this.props;

    return products.map(p => (
      <ErxesRow
        history={history}
        key={p._id}
        product={p}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(p)}
      />
    ));
  };

  renderErkhetRow = () => {
    const { erkhetProducts } = this.props;

    return erkhetProducts.map(p => (
      <ErkhetRow history={history} key={p._id} product={p} />
    ));
  };

  onChange = () => {
    const { toggleAll, products } = this.props;
    toggleAll(products, 'products');
  };
  renderErkhetSide = () => {
    const header = <Wrapper.ActionBar left={<Title>Erkhet Products</Title>} />;
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
              <th>{__('Category')}</th>
              <th>{__('Bar code')}</th>
              <th>{__('Weight')}</th>
              <th>{__('Unit Price')}</th>
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
        left={<Title>Erxes Products</Title>}
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
              <th>{__('Type')}</th>
              <th>{__('Category code')}</th>
              <th>{__('Product count')}</th>
              <th>{__('Unit Price')}</th>
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
            title={__(`Check product`)}
            queryParams={this.props.queryParams}
            submenu={menuPos}
          />
        }
        content={content}
        // footer={<Pagination count={4} />}
      />
    );
  }
}

export default InventoryProducts;
