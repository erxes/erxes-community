import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import Button from '@erxes/ui/src/components/Button';
import { SidebarList } from '@erxes/ui/src/layout/styles';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { SidebarListItem, ActionButtons } from '../styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { IAssetCategory } from '../types';
import { TopHeader } from '@erxes/ui/src/styles/main';
import { Link } from 'react-router-dom';
import AssetsCategoryForm from '../containers/AssetsCategoryForm';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import { __ } from '@erxes/ui/src/utils/core';

const { Section } = Wrapper.Sidebar;

type Props = {
  queryParams: any;
  refetch: any;
  assetCategories: IAssetCategory[];
  remove: (assetsCategoryId: string) => void;
};

class ListComp extends React.Component<Props> {
  renderFormTrigger(trigger, category?: IAssetCategory) {
    const content = props => (
      <AssetsCategoryForm {...props} category={category} />
    );

    return (
      <ModalTrigger title="Add category" trigger={trigger} content={content} />
    );
  }

  renderEditAction(category: IAssetCategory) {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    return this.renderFormTrigger(trigger, category);
  }

  renderRemoveAction(category: IAssetCategory) {
    const { remove } = this.props;

    return (
      <Button btnStyle="link" onClick={remove.bind(null, category._id)}>
        <Tip text={__('Remove')} placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  }

  Header() {
    const trigger = (
      <Button
        btnStyle="success"
        uppercase={false}
        icon="plus-circle"
        block={true}
      >
        Add category
      </Button>
    );

    return (
      <>
        <TopHeader>{this.renderFormTrigger(trigger)}</TopHeader>
        {/* <Section.Title>
          {__('Categories')}
          <Section.QuickButtons>
            {router.getParam(this.props.history, 'categoryId') && (
              <a href="#cancel" tabIndex={0} onClick={this.clearCategoryFilter}>
                <Tip text={__('Clear filter')} placement="bottom">
                  <Icon icon="cancel-1" />
                </Tip>
              </a>
            )}
          </Section.QuickButtons>
        </Section.Title> */}
      </>
    );
  }
  isActive = (id: string) => {
    const { queryParams } = this.props;
    const currentGroup = queryParams.categoryId || '';

    return currentGroup === id;
  };

  renderContent() {
    const { assetCategories } = this.props;

    const result: React.ReactNode[] = [];

    for (const category of assetCategories) {
      const order = category.order;

      const m = order.match(/[/]/gi);

      let space = '';

      if (m) {
        space = '\u00a0\u00a0'.repeat(m.length);
      }

      const name = category.isRoot ? (
        `${category.name} (${0})`
      ) : (
        <span>
          {category.name} ({0})
        </span>
      );

      result.push(
        <SidebarListItem
          key={category._id}
          isActive={this.isActive(category._id)}
          isParent={category.parentId === ''}
        >
          <Link to={`?categoryId=${category._id}`}>
            {space}
            {name}
          </Link>

          <ActionButtons>
            {this.renderEditAction(category)}\
            {this.renderRemoveAction(category)}
          </ActionButtons>
        </SidebarListItem>
      );
    }

    return result;
  }

  Content() {
    return (
      <SidebarList>
        <DataWithLoader
          data={this.renderContent()}
          loading={false}
          count={2}
          emptyText="There is no assets category"
          emptyIcon="folder-2"
          size="small"
        />
      </SidebarList>
    );
  }

  render() {
    return (
      <Sidebar>
        <Section>
          {this.Header()}
          {this.Content()}
        </Section>
      </Sidebar>
    );
  }
}

export default ListComp;
