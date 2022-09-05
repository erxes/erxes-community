import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import Table from '@erxes/ui/src/components/table';
import FormControl from '@erxes/ui/src/components/form/Control';
import { VerticalDivider, VLeftSplit, VRightSplit, VSplit } from '../../styles';
import { Title } from '@erxes/ui-settings/src/styles';
import Row from './InventoryProductsRow';

type Props = {
  loading: boolean;
  products: any[];
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
    const { products } = this.props;

    return products.map(p => (
      <Row
        history={history}
        key={p._id}
        product={p}
        // toggleBulk={toggleBulk}
        // isChecked={bulk.includes(product)}
      />
    ));
  };

  renderErkhetSide = () => {
    const header = <Wrapper.ActionBar left={<Title>Erkhet Products</Title>} />;
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th style={{ width: 60 }}>
                <FormControl
                  checked={true}
                  componentClass="checkbox"
                  onChange={() => {}}
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
          {/* <tbody>{this.renderRow()}</tbody> */}
        </Table>
      </>
    );
  };

  renderErxesSide = () => {
    const { products } = this.props;
    const header = <Wrapper.ActionBar left={<Title>Erxes Products</Title>} />;
    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th style={{ width: 60 }}>
                <FormControl
                  checked={true}
                  componentClass="checkbox"
                  onChange={() => {}}
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
          <tbody>{this.renderRow()}</tbody>
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
            // queryParams={queryParams}
            submenu={menuPos}
          />
        }
        content={content}
        // footer={<Pagination count={totalCount} />}
      />
    );
  }
}

export default InventoryProducts;
