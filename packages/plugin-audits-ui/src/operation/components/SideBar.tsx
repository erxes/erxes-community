import React from 'react';
import { Button, ModalTrigger, Wrapper } from '@erxes/ui/src';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import FormContainer from '../categories/containers/Form';
import ListContainer from '../categories/containers/List';
type Props = {
  queryParams: IQueryParams;
} & IRouterProps;

class SideBar extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderForm() {
    const trigger = (
      <Button btnStyle="success" block>
        Add Category
      </Button>
    );
    const content = props => {
      const updatedProps = {
        ...props,
        ...this.props
      };
      return <FormContainer {...updatedProps} />;
    };

    return <ModalTrigger title="Add Operation Category" content={content} trigger={trigger} />;
  }

  renderList() {
    const updatedProps = {
      ...this.props
    };

    return <ListContainer {...updatedProps} />;
  }

  render() {
    return (
      <Wrapper.Sidebar>
        {this.renderForm()}
        {this.renderList()}
      </Wrapper.Sidebar>
    );
  }
}

export default SideBar;
