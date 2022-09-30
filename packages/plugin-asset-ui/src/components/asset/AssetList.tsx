import { Alert, __, confirm, router } from '@erxes/ui/src/utils';
import { Count, Title } from '@erxes/ui/src/styles/main';
import { IAsset, IAssetCategory } from '../../types';

import { BarItems } from '@erxes/ui/src/layout/styles';
import Button from '@erxes/ui/src/components/Button';
import CategoryList from '../../containers/assetCategory/CategoryList';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Form from '@erxes/ui-assets/src/containers/AssetForm';
import FormControl from '@erxes/ui/src/components/form/Control';
import HeaderDescription from '@erxes/ui/src/components/HeaderDescription';
import { IRouterProps } from '@erxes/ui/src/types';
import { Link } from 'react-router-dom';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import AssetsMerge from './detail/AssetsMerge';
import React from 'react';
import Row from './AssetRow';
import { TAG_TYPES } from '@erxes/ui-tags/src/constants';
import Table from '@erxes/ui/src/components/table';
import TaggerPopover from '@erxes/ui-tags/src/components/TaggerPopover';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { isEnabled } from '@erxes/ui/src/utils/core';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  assets: IAsset[];
  assetsCount: number;
  isAllSelected: boolean;
  bulk: any[];
  emptyBulk: () => void;
  remove: (doc: { assetIds: string[] }, emptyBulk: () => void) => void;
  toggleBulk: () => void;
  toggleAll: (targets: IAsset[], containerId: string) => void;
  loading: boolean;
  searchValue: string;
  currentCategory: IAssetCategory;
  mergeAssets: () => void;
  mergeAssetLoading;
}

type State = {
  searchValue?: string;
};

class List extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue
    };
  }

  renderRow = () => {
    const { assets, history, toggleBulk, bulk } = this.props;

    return assets.map(asset => (
      <Row
        history={history}
        key={asset._id}
        asset={asset}
        toggleBulk={toggleBulk}
        isChecked={bulk.includes(asset)}
      />
    ));
  };

  onChange = () => {
    const { toggleAll, assets } = this.props;
    toggleAll(assets, 'assets');
  };

  removeAssets = assets => {
    const assetIds: string[] = [];

    assets.forEach(asset => {
      assetIds.push(asset._id);
    });

    this.props.remove({ assetIds }, this.props.emptyBulk);
  };

  renderCount = assetCount => {
    return (
      <Count>
        {assetCount} asset{assetCount > 1 && 's'}
      </Count>
    );
  };

  search = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });

    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  moveCursorAtTheEnd(e) {
    const tmpValue = e.target.value;

    e.target.value = '';
    e.target.value = tmpValue;
  }

  render() {
    const {
      assetsCount,
      loading,
      queryParams,
      isAllSelected,
      history,
      bulk,
      emptyBulk,
      currentCategory,
      mergeAssets,
      mergeAssetLoading
    } = this.props;

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Asset & Service') }
    ];

    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        Add items
      </Button>
    );

    const modalContent = props => <Form {...props} />;

    let actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <Link to="/settings/importHistories?type=asset">
          <Button btnStyle="simple" icon="arrow-from-right">
            {__('Import items')}
          </Button>
        </Link>
        <ModalTrigger
          title="Add Asset/Services"
          trigger={trigger}
          autoOpenKey="showAssetModal"
          content={modalContent}
          size="lg"
        />
      </BarItems>
    );

    let content = (
      <>
        {this.renderCount(currentCategory.assetCount || assetsCount)}
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
              <th>{__('Category')}</th>
              <th>{__('Supply')}</th>
              <th>{__('Asset count')}</th>
              <th>{__('Minimium count')}</th>
              <th>{__('Unit Price')}</th>
              <th>{__('SKU')}</th>
              <th>{__('Tags')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );

    if (currentCategory.assetCount === 0) {
      content = <EmptyState image="/images/actions/8.svg" text="No Brands" size="small" />;
    }

    const assetsMerge = props => {
      return (
        <AssetsMerge
          {...props}
          objects={bulk}
          save={mergeAssets}
          mergeAssetLoading={mergeAssetLoading}
        />
      );
    };

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small" icon="tag-alt">
          Tag
        </Button>
      );

      const onClick = () =>
        confirm()
          .then(() => {
            this.removeAssets(bulk);
          })
          .catch(error => {
            Alert.error(error.message);
          });

      const mergeButton = (
        <Button btnStyle="primary" size="small" icon="merge">
          Merge
        </Button>
      );

      actionBarRight = (
        <BarItems>
          {bulk.length === 2 && (
            <ModalTrigger
              title="Merge Asset"
              size="lg"
              dialogClassName="modal-1000w"
              trigger={mergeButton}
              content={assetsMerge}
            />
          )}
          {isEnabled('tags') && (
            <TaggerPopover
              type={TAG_TYPES.PRODUCT}
              successCallback={emptyBulk}
              targets={bulk}
              trigger={tagButton}
              refetchQueries={['assetCountByTags']}
            />
          )}
          <Button btnStyle="danger" size="small" icon="cancel-1" onClick={onClick}>
            Remove
          </Button>
        </BarItems>
      );
    }

    const actionBarLeft = <Title>{currentCategory.name || 'All assets'}</Title>;

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Asset & Service')} breadcrumb={breadcrumb} />}
        mainHead={
          <HeaderDescription
            icon="/images/actions/30.svg"
            title={'Asset & Service'}
            description={`${__(
              'All information and know-how related to your business assets and services are found here'
            )}.${__(
              'Create and add in unlimited assets and servicess so that you and your team members can edit and share'
            )}`}
          />
        }
        actionBar={<Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} />}
        leftSidebar={<CategoryList queryParams={queryParams} history={history} />}
        footer={<Pagination count={assetsCount} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={assetsCount}
            emptyText="There is no data"
            emptyImage="/images/actions/5.svg"
          />
        }
        transparent={true}
        hasBorder
      />
    );
  }
}

export default List;
