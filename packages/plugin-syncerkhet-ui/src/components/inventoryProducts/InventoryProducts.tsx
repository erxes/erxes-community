import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import Table from '@erxes/ui/src/components/table';
import FormControl from '@erxes/ui/src/components/form/Control';
import { Title } from '@erxes/ui-settings/src/styles';
import Button from '@erxes/ui/src/components/Button';
import Row from './InventoryProductsRow';

type Props = {
  loading: boolean;
  products: any[];
  history: any;
  queryParams: any;
  isAllSelected: boolean;
  bulk: any[];
  toggleBulk: () => void;
  emptyBulk: () => void;
  toggleAll: (targets: any[], containerId: string) => void;
  toCheckProducts: (productCodes: string[]) => void;
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

  renderRow = () => {
    const { products, toggleBulk, bulk } = this.props;

    return products.map(p => (
      <Row
        history={history}
        key={p._id}
        product={p}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(p)}
      />
    ));
  };

  onChange = () => {
    const { toggleAll, products } = this.props;
    toggleAll(products, 'products');
  };

  renderTable = () => {
    const { bulk, toCheckProducts } = this.props;
    const onClickCheck = () => {
      const codes = bulk.map(b => b.code);
      toCheckProducts(codes);
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
      <Wrapper.ActionBar left={<Title>Products</Title>} right={syncButton} />
    );
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
              <th>{__('Type')}</th>
              <th>{__('Category code')}</th>
              <th>{__('Product count')}</th>
              <th>{__('Unit Price')}</th>
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
            title={__(`Check product`)}
            queryParams={this.props.queryParams}
            submenu={menuPos}
          />
        }
        content={this.renderTable()}
        // footer={<Pagination count={4} />}
      />
    );
  }
}

export default InventoryProducts;
