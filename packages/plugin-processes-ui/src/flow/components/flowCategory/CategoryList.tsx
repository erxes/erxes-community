import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Icon from '@erxes/ui/src/components/Icon';
import React from 'react';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import Tip from '@erxes/ui/src/components/Tip';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import { IFlowCategory } from '../../types';
import { Link } from 'react-router-dom';
import { SidebarList } from '@erxes/ui/src/layout/styles';
import { SidebarListItem } from '@erxes/ui-settings/src/styles';

const { Section } = Wrapper.Sidebar;

interface IProps {
  history: any;
  queryParams: any;
  remove: (IProductCategory: string) => void;
  flowCategories: IFlowCategory[];
  loading: boolean;
  flowCategoriesCount: number;
}

class List extends React.Component<IProps> {
  clearCategoryFilter = () => {
    router.setParams(this.props.history, { categoryId: null });
  };

  isActive = (id: string) => {
    const { queryParams } = this.props;
    const currentGroup = queryParams.categoryId || '';

    return currentGroup === id;
  };

  renderRemoveAction(category: IFlowCategory) {
    const { remove } = this.props;

    return (
      <Button btnStyle="link" onClick={remove.bind(null, category._id)}>
        <Tip text={__('Remove')} placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  }

  renderContent() {
    const { flowCategories } = this.props;

    const result: React.ReactNode[] = [
      <SidebarListItem
        key={'unknownCategory'}
        isActive={this.isActive('unknownCategory')}
      >
        <Link to={`?categoryId=${'unknownCategory'}`}>
          {__('!Unknown Category')}
        </Link>
      </SidebarListItem>
    ];

    for (const category of flowCategories) {
      const order = category.order || '';

      const m = order.match(/[/]/gi);

      let space = '';

      if (m) {
        space = '\u00a0\u00a0'.repeat(m.length);
      }

      const name = category.isRoot ? (
        `${category.name} (${category.flowCount || 0})`
      ) : (
        <span>
          {category.name} ({category.flowCount || 0})
        </span>
      );

      result.push(
        <SidebarListItem
          key={category._id}
          isActive={this.isActive(category._id)}
        >
          <Link to={`?categoryId=${category._id}`}>
            {space}
            {name}
          </Link>
        </SidebarListItem>
      );
    }

    return result;
  }

  renderCategoryHeader() {
    return (
      <>
        <Section.Title>
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
        </Section.Title>
      </>
    );
  }

  renderCategoryList() {
    const { flowCategoriesCount, loading } = this.props;

    return (
      <SidebarList>
        <DataWithLoader
          data={this.renderContent()}
          loading={loading}
          count={flowCategoriesCount}
          emptyText="There is no flow category"
          emptyIcon="folder-2"
          size="small"
        />
      </SidebarList>
    );
  }

  render() {
    return (
      <Sidebar wide={true} hasBorder={true}>
        <Section
          maxHeight={488}
          collapsible={this.props.flowCategoriesCount > 9}
        >
          {this.renderCategoryHeader()}
          {this.renderCategoryList()}
        </Section>
      </Sidebar>
    );
  }
}

export default List;
