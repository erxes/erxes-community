import { BarItems, Button, ModalTrigger } from '@erxes/ui/src';
import { IBulkContentProps } from '@erxes/ui/src/components/Bulk';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { DefaultWrapper } from '../../common/utils';
import FormContainer from '../containers/Form';
import SideBar from './SideBar';

type Props = {
  queryParams: IQueryParams;
} & IRouterProps &
  IBulkContentProps;

class List extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderForm() {
    const trigger = <Button btnStyle="success">Add Operations</Button>;

    const content = props => {
      const updatedProps = {
        ...props,
        ...this.props
      };

      return <FormContainer {...updatedProps} />;
    };

    return <ModalTrigger content={content} trigger={trigger} title="Add Operation" />;
  }

  render() {
    let rightActionBar = <BarItems>{this.renderForm()}</BarItems>;

    const updatedProps = {
      title: 'Operations',
      rightActionBar,
      content: <>Hello World</>,
      sidebar: <SideBar {...this.props} />
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
