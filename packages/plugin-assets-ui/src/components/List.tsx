import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, confirm } from '@erxes/ui/src/utils';
import React from 'react';
import { BarItems } from '@erxes/ui/src/layout/styles';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/table';
import withTableWrapper from '@erxes/ui/src/components/table/withTableWrapper';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Sidebar from './SideBar';
import { ModalTrigger } from '@erxes/ui/src/components';
import AssetsForm from '../containers/AssetsForm';
import { IAssets } from '../types';
import FormControl from '@erxes/ui/src/components/form/Control';
import AssetsRow from './AssetsRow';
import Alert from '@erxes/ui/src/utils/Alert';

type Props = {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  assets: IAssets[];
  isAllSelected: boolean;
  toggleAll: (targets: IAssets[], containerId: string) => void;
  bulk: any[];
  toggleBulk: () => void;
  emptyBulk: () => void;
  assetsRemove: (doc: { assetIds: string[] }, emptyBulk: () => void) => void;
};

type State = {};

class List extends React.Component<Props, State> {
  renderForm = props => {
    return <AssetsForm {...props} />;
  };

  assetsRemove = assets => {
    const assetIds: string[] = [];

    assets.forEach(car => {
      assetIds.push(car._id);
    });

    this.props.assetsRemove({ assetIds }, this.props.emptyBulk);
  };

  onChange = () => {
    const { toggleAll, assets } = this.props;
    toggleAll(assets, 'assets');
  };

  renderRow({ objects }) {
    return objects.map((object, index) => (
      <tr key={index}>
        <h5>{object.name}</h5>
      </tr>
    ));
  }

  render() {
    const {
      assets,
      history,
      queryParams,
      renderButton,
      isAllSelected,
      bulk,
      toggleBulk
    } = this.props;

    const assetsForm = props => {
      return <AssetsForm {...props} />;
    };

    const addTrigger = (
      <Button btnStyle="success" size="small" icon="plus-circle">
        Add assets
      </Button>
    );

    const actionBarRight = (
      <BarItems>
        <ModalTrigger
          title="New assets"
          trigger={addTrigger}
          autoOpenKey="showAssetsModal"
          size="lg"
          content={assetsForm}
          backDrop="static"
        />
      </BarItems>
    );

    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      const onClick = () =>
        confirm()
          .then(() => {
            this.assetsRemove(bulk);
          })
          .catch(e => {
            Alert.error(e.message);
          });

      actionBarLeft = (
        <BarItems>
          <Button
            btnStyle="danger"
            size="small"
            icon="times-circle"
            onClick={onClick}
          >
            Delete
          </Button>
        </BarItems>
      );
    }

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    const renderAssetsContent = (
      <withTableWrapper.Wrapper>
        <Table
          whiteSpace="nowrap"
          hover={true}
          bordered={true}
          responsive={true}
          wideHeader={true}
        >
          <thead>
            <tr>
              <th>
                <FormControl
                  componentClass="checkbox"
                  checked={isAllSelected}
                  onChange={this.onChange}
                />
              </th>
              <th>{__('Assets Name')}</th>
              <th>{__('Code')}</th>
              <th>{__('Unit Price')}</th>
              <th>{__('Used At')}</th>
            </tr>
          </thead>
          <tbody id="clientPortalUsers">
            {(assets || []).map((asset, i) => (
              <AssetsRow
                assets={asset}
                key={asset._id}
                isChecked={bulk.includes(asset)}
                toggleBulk={toggleBulk}
                history={history}
              />
            ))}
          </tbody>
        </Table>
      </withTableWrapper.Wrapper>
    );

    return (
      <Wrapper
        leftSidebar={
          <Sidebar
            // loadingMainQuery={loading}
            queryParams={queryParams}
            history={history}
            renderButton={renderButton}
          />
        }
        actionBar={actionBar}
        content={
          <DataWithLoader
            data={renderAssetsContent}
            loading={false}
            count={1}
            emptyText="Add in your first assets!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default List;
