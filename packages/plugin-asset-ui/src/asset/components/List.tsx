import { BarItems, Button, FormControl, ModalTrigger, router, Table, __, confirm, Alert } from '@erxes/ui/src';
import React from 'react';
import { IAsset, IAssetGroup } from '../../common/types';
import { DefaultWrapper } from '../../common/utils';
import Form from '../containers/Form';
import Row from './Row';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import { isEnabled } from '@erxes/ui/src/utils/core';
import TaggerPopover from '@erxes/ui-tags/src/components/TaggerPopover';
import { TAG_TYPES } from '@erxes/ui-tags/src/constants';
import MergeAsset from './Merge';

type Props = {
  assets: IAsset[];
  assetsCount: number;
  history: any;
  queryParams: any;
  isAllSelected: boolean;
  bulk: any[];
  emptyBulk: () => void;
  remove: (doc: { assetIds: string[] }, emptyBulk: () => void) => void;
  toggleBulk: () => void;
  toggleAll: (targets: IAsset[], containerId: string) => void;
  loading: boolean;
  searchValue: string;
  currentCategory: IAssetGroup;
  mergeAssets: () => void;
  mergeAssetLoading;
};

type State = {
  searchValue?: string;
};

class List extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);
    this.state = {
      searchValue: this.props.searchValue
    };
  }

  renderRightActionBarTrigger = (
    <Button btnStyle='success' icon='plus-circle'>
      Add Assets
    </Button>
  );

  renderFormContent = props => {
    return <Form {...props} />;
  };

  renderRightActionBar = (
    <ModalTrigger
      title='Add Assets'
      trigger={this.renderRightActionBarTrigger}
      content={this.renderFormContent}
      autoOpenKey='showListFormModal'
      dialogClassName='transform'
      size='lg'
    />
  );

  renderRow() {
    const { assets, history, toggleBulk, bulk } = this.props;

    return assets.map(asset => <Row history={history} key={asset._id} asset={asset} toggleBulk={toggleBulk} isChecked={bulk.includes(asset)} />);
  }
  onChange = () => {
    const { toggleAll, assets } = this.props;
    toggleAll(assets, 'assets');
  };

  renderContent = () => {
    const { isAllSelected } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>
              <FormControl checked={isAllSelected} componentClass='checkbox' onChange={this.onChange} />
            </th>
            <th>{__('Code')}</th>
            <th>{__('Name')}</th>
            <th>{__('Type')}</th>
            <th>{__('Group')}</th>
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
    );
  };

  assetsMerge = props => {
    const { bulk, mergeAssets, mergeAssetLoading } = this.props;
    return <MergeAsset {...props} objects={bulk} save={mergeAssets} mergeAssetLoading={mergeAssetLoading} />;
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
  removeAssets = assets => {
    const assetIds: string[] = [];

    assets.forEach(asset => {
      assetIds.push(asset._id);
    });

    this.props.remove({ assetIds }, this.props.emptyBulk);
  };

  render() {
    const { bulk, emptyBulk } = this.props;

    let rightActionBar = (
      <BarItems>
        <FormControl
          type='text'
          placeholder={__('Type to search')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <Link to='/settings/importHistories?type=asset'>
          <Button btnStyle='simple' icon='arrow-from-right'>
            {__('Import items')}
          </Button>
        </Link>
        {this.renderRightActionBar}
      </BarItems>
    );

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle='simple' size='small' icon='tag-alt'>
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
        <Button btnStyle='primary' size='small' icon='merge'>
          Merge
        </Button>
      );

      rightActionBar = (
        <BarItems>
          {bulk.length === 2 && (
            <ModalTrigger title='Merge Asset' size='lg' dialogClassName='modal-1000w' trigger={mergeButton} content={this.assetsMerge} />
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
          <Button btnStyle='danger' size='small' icon='cancel-1' onClick={onClick}>
            Remove
          </Button>
        </BarItems>
      );
    }

    const updatedProps = {
      title: 'List Assets',
      rightActionBar: rightActionBar,
      content: this.renderContent(),
      sidebar: <SideBar />,
      totalCount: this.props.assetsCount,
      isPaginationHide: true
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
