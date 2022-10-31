import { ActionButtons, SidebarListItem } from '@erxes/ui-settings/src/styles';
import {
  Box,
  Button,
  DataWithLoader,
  Icon,
  ModalTrigger,
  SidebarList,
  Tip,
  Wrapper,
  __
} from '@erxes/ui/src';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { IOperationCategories } from '../../common/types';
import { subOption } from '../../common/utils';
import FormContainer from '../containers/Form';

const { Section } = Wrapper.Sidebar;

type Props = {
  queryParams: IQueryParams;
  list: IOperationCategories[];
  totalCount: number;
  loading: boolean;
  remove: (variables: any) => void;
} & IRouterProps;

class List extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderEditAction(_id: string) {
    const trigger = (
      <Button btnStyle="link">
        <Tip placement="bottom" text="Edit category">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => {
      const updatedProps = {
        ...props,
        ...this.props,
        categoryId: _id
      };

      return <FormContainer {...updatedProps} />;
    };

    return <ModalTrigger content={content} trigger={trigger} title="Edit Category" />;
  }

  renderRemoveAction(_id: string) {
    const { remove } = this.props;

    return (
      <Button btnStyle="link" onClick={() => remove(_id)}>
        <Tip text="Remove category" placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  }

  renderList() {
    const { list, totalCount } = this.props;

    return list.map(category => (
      <SidebarListItem key={category._id} isActive={false}>
        <Link to={`?categoryId=${category._id}`}>
          {category.parentId && subOption(category)}
          {category.name}
        </Link>
        <ActionButtons>
          {this.renderEditAction(category._id)}
          {this.renderRemoveAction(category._id)}
        </ActionButtons>
      </SidebarListItem>
    ));
  }

  renderContent() {
    const { list, totalCount, loading } = this.props;

    return (
      <SidebarList>
        <DataWithLoader
          data={this.renderList()}
          loading={loading}
          count={totalCount}
          emptyText="There is no risk asssessment category"
          emptyIcon="folder-2"
          size="small"
        />
      </SidebarList>
    );
  }

  render() {
    const { totalCount } = this.props;

    return (
      <Section maxHeight={500} collapsible={totalCount > 9} noMargin noShadow>
        <Box title={__('Categories')} name="categories">
          {this.renderContent()}
        </Box>
      </Section>
    );
  }
}

export default List;
