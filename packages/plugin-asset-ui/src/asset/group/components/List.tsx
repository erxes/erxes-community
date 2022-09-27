import { SidebarListItem, ActionButtons } from '@erxes/ui-settings/src/styles';
import { Box, Button, DataWithLoader, Icon, ModalTrigger, SidebarList, Spinner, Tip } from '@erxes/ui/src';
import React from 'react';
import { IAssetGroup, IAssetGroupTypes } from '../../../common/types';
import { ContainerBox } from '../../../style';
import Form from '../containers/Form';
import { Link } from 'react-router-dom';

type Props = {
  list: [IAssetGroupTypes];
  totalCount: number;
  loading: boolean;
  remove: (_id) => any;
};

class List extends React.Component<Props> {
  addFormTrigger = (
    <Button btnStyle='success' icon='plus-circle' block>
      Add Group
    </Button>
  );

  renderFormContent = props => {
    return <Form {...props} />;
  };

  renderAddForm() {
    return <ModalTrigger title='Add Asset Group' trigger={this.addFormTrigger} content={this.renderFormContent} />;
  }

  renderEditAction() {
    const trigger = (
      <Button btnStyle='link'>
        <Tip text='Edit'>
          <Icon icon='edit' />
        </Tip>
      </Button>
    );

    const content = props => {
      return <Form {...props} />;
    };

    return <ModalTrigger isAnimate title='Edit Asset Group' content={content} trigger={trigger} />;
  }

  renderRemoveAction(_id) {
    const handleRemove = () => {
      this.props.remove(_id);
    };

    return (
      <Button btnStyle='link' onClick={handleRemove}>
        <Tip text='remove' placement='bottom'>
          <Icon icon='cancel-1' />
        </Tip>
      </Button>
    );
  }

  renderContent() {
    const { list, loading } = this.props;

    if (loading) {
      <Spinner objective />;
    }

    return list.map(item => (
      <SidebarListItem key={item._id} isActive={false}>
        <Link to='/'>{item.name}</Link>
        <ActionButtons>
          {this.renderEditAction()}
          {this.renderRemoveAction(item._id)}
        </ActionButtons>
      </SidebarListItem>
    ));
  }

  renderGroupList() {
    const { totalCount, loading } = this.props;

    return (
      <SidebarList>
        <DataWithLoader
          data={this.renderContent()}
          loading={loading}
          count={totalCount}
          emptyText='There is no risk asssessment category'
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
