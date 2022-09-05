import { Title } from '@erxes/ui-settings/src/styles';
import FormControl from '@erxes/ui/src/components/form/Control';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { VerticalDivider, VLeftSplit, VRightSplit, VSplit } from '../../styles';
import Row from './InventoryCategoryRow';

type Props = {
  loading: boolean;
  categories: any[];
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
    const { categories } = this.props;

    return categories.map(category => (
      <Row
        history={history}
        key={category._id}
        category={category}
        // toggleBulk={toggleBulk}
        // isChecked={bulk.includes(product)}
      />
    ));
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
              <th>{__('Category')}</th>
              <th>{__('Product count')}</th>
              <th>{__('Status')}</th>
            </tr>
          </thead>
          {/* <tbody>{this.renderRow()}</tbody> */}
        </Table>
      </>
    );
  };

  renderErxesSide = () => {
    const { categories } = this.props;
    const header = (
      <Wrapper.ActionBar left={<Title>Erxes Product Categories</Title>} />
    );
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

export default InventoryCategory;
