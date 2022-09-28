import { SidebarListItem, ActionButtons } from '@erxes/ui-settings/src/styles';
import { Box, Button, DataWithLoader, Icon, ModalTrigger, SidebarList, Spinner, Tip } from '@erxes/ui/src';
import React from 'react';
import { IAssetGroup, IAssetGroupTypes } from '../../../common/types';
import { ContainerBox } from '../../../style';
import Form from '../containers/Form';
import { Link } from 'react-router-dom';

type Props = {
  assetGroups: IAssetGroupTypes[];
  totalCount: number;
  loading: boolean;
  remove: (_id) => any;
  refetchAssetGroups: () => void;
};

class List extends React.Component<Props> {
  addFormTrigger = (
    <Button btnStyle='success' icon='plus-circle' block>
      Add Group
    </Button>
  );

  renderFormContent = props => {
    const { refetchAssetGroups, assetGroups } = this.props;

    const updatedProps = {
      ...props,
      refetchAssetGroups,
      groups: assetGroups
    };

    return <Form {...updatedProps} />;
  };

  renderAddForm() {
    return <ModalTrigger title='Add Asset Group' trigger={this.addFormTrigger} content={this.renderFormContent} />;
  }

  renderEditAction(group) {
    const trigger = (
      <Button btnStyle='link'>
        <Tip text='Edit'>
          <Icon icon='edit' />
        </Tip>
      </Button>
    );

    const content = props => {
      const { refetchAssetGroups, assetGroups } = this.props;

      const updatedProps = {
        ...props,
        refetchAssetGroups,
        group,
        groups: assetGroups
      };

      return <Form {...updatedProps} />;
    };

    return <ModalTrigger isAnimate title='Edit Asset Group' content={content} trigger={trigger} />;
  }

  renderRemoveAction(_id) {
    const { remove } = this.props;

    return (
      <Button btnStyle='link' onClick={() => remove(_id)}>
        <Tip text='remove' placement='bottom'>
          <Icon icon='cancel-1' />
        </Tip>
      </Button>
    );
  }

  renderContent() {
    const { assetGroups, loading } = this.props;

    if (loading) {
      return <Spinner objective />;
    }

    const result: React.ReactNode[] = [];

    for (const group of assetGroups) {
      const order = group.order;

      const m = order.match(/[/]/gi);

      let space = '';

      if (m) {
        space = '\u00a0\u00a0'.repeat(m.length);
      }
      const name = group.isRoot ? (
        `${group.name} (${group.assetCount})`
      ) : (
        <span>
          {group.name} ({group.assetCount})
        </span>
      );

      result.push(
        <SidebarListItem key={group._id} isActive={false}>
          <Link to={`?orderId=${group._id}`}>
            {space}
            {name}
          </Link>
          <ActionButtons>
            {this.renderEditAction(group)}
            {this.renderRemoveAction(group._id)}
          </ActionButtons>
        </SidebarListItem>
      );
    }
    return result;
  }

  renderGroupList() {
    const { totalCount, loading } = this.props;

    return (
      <SidebarList>
        <DataWithLoader
          data={this.renderContent()}
          loading={loading}
          count={totalCount}
          emptyText='There is no asset group'
          emptyIcon='folder-2'
          size='small'
        />
      </SidebarList>
    );
  }

  renderAssetGroups() {
    return <Box title='Asset Group'>{this.renderGroupList()}</Box>;
  }

  render() {
    return (
      <ContainerBox gap={15} column>
        {this.renderAddForm()}
        {this.renderAssetGroups()}
      </ContainerBox>
    );
  }
}

export default List;
