import { CollapseContent, Pagination } from '@erxes/ui/src/components';
import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import Row from './InventoryCategoryRow';

type Props = {
  loading: boolean;
  history: any;
  queryParams: any;
  toCheckCategories: () => void;
  toSyncCategories: (action: string, categories: any[]) => void;
  items: any;
};

type State = {
  openCollapse: Number;
  loading: boolean;
};

export const menuPos = [
  { title: 'Check deals', link: '/check-synced-deals' },
  { title: 'Check orders', link: '/check-pos-orders' },
  { title: 'Check Category', link: '/inventory-category' },
  { title: 'Check Products', link: '/inventory-products' }
];

class InventoryCategory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCollapse: -1,
      loading: false
    };
  }

  renderRow = (data: any) => {
    return data.map(c => <Row history={history} key={c.code} category={c} />);
  };

  renderTable = (data: any, action: string) => {
    const data_len = data.length;

    if (data_len > 20) {
      data = data.slice(0, 20);
    }

    const onClickSync = () => {
      this.props.toSyncCategories(action, data);
    };
    const syncButton = (
      <>
        <Button
          btnStyle="primary"
          size="small"
          icon="check-1"
          onClick={onClickSync}
        >
          Sync
        </Button>
      </>
    );
    const header = (
      <Wrapper.ActionBar
        left={
          data_len > 20 ? (
            <>20 of {data_len} </>
          ) : (
            <>
              {data_len} of {data_len}
            </>
          )
        }
        right={syncButton}
      />
    );

    const pagination = (
      <div>
        <Pagination count={10} />
      </div>
    );

    return (
      <>
        {header}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Code')}</th>
              <th>{__('Name')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow(data)}</tbody>
        </Table>
        {pagination}
      </>
    );
  };

  render() {
    const { items } = this.props;
    const { openCollapse } = this.state;

    const onClickCheck = () => {
      this.props.toCheckCategories();
    };

    const checkOpenCollapse = (num: number): boolean => {
      return openCollapse == num ? true : false;
    };

    const onChangeCollapse = (num: number): void => {
      if (num !== openCollapse) {
        this.setState({ loading: true });

        this.setState({ openCollapse: num }, () => {
          this.setState({ loading: false });
        });
      }
    };

    const checkButton = (
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
    const header = <Wrapper.ActionBar right={checkButton} />;
    const content = (
      <>
        {header}
        <br />
        <CollapseContent
          title={__(
            'Create categories' +
              (items.create ? ':  ' + items.create.count : '')
          )}
          id={'1'}
          onClick={() => {
            onChangeCollapse(1);
          }}
          open={checkOpenCollapse(1)}
        >
          <DataWithLoader
            data={
              items.create
                ? this.renderTable(items.create?.items, 'CREATE')
                : []
            }
            loading={false}
            emptyText={'Please check first.'}
            emptyIcon="leaf"
            size="large"
            objective={true}
          />
        </CollapseContent>
        <CollapseContent
          title={__(
            'Update categories' +
              (items.update ? ':  ' + items.update.count : '')
          )}
          id={'2'}
          onClick={() => {
            onChangeCollapse(2);
          }}
          open={checkOpenCollapse(2)}
        >
          <DataWithLoader
            data={
              items.update ? this.renderTable(items.update.items, 'UPDATE') : []
            }
            loading={false}
            emptyText={'Please check first.'}
            emptyIcon="leaf"
            size="large"
            objective={true}
          />
        </CollapseContent>
        <CollapseContent
          title={__(
            'Delete categories' +
              (items.delete ? ':  ' + items.delete.count : '')
          )}
          id={'3'}
          onClick={() => {
            onChangeCollapse(3);
          }}
          open={checkOpenCollapse(3)}
        >
          <DataWithLoader
            data={
              items.delete ? this.renderTable(items.delete.items, 'DELETE') : []
            }
            loading={false}
            emptyText={'Please check first.'}
            emptyIcon="leaf"
            size="large"
            objective={true}
          />
        </CollapseContent>
      </>
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
        content={
          <DataWithLoader
            data={content}
            loading={this.props.loading || this.state.loading}
          />
        }
        hasBorder
      />
    );
  }
}

export default InventoryCategory;
