import { Button, FormControl, ModalTrigger, Table } from '@erxes/ui/src';
import React from 'react';
import { DefaultWrapper } from '../../common/utils';
import Form from './Form';
import SideBar from './SideBar';

type Props = {};

class List extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderRightActionBarTrigger = (
    <Button btnStyle='success' icon='plus-circle'>
      Add Assets
    </Button>
  );

  renderFormContent = () => {
    return <Form />;
  };

  renderRightActionBar = (
    <ModalTrigger
      title='Add Assets'
      trigger={this.renderRightActionBarTrigger}
      content={this.renderFormContent}
      autoOpenKey='showListFormModal'
      dialogClassName='transform'
    />
  );

  renderContent = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl componentClass='checkbox' checked={false} />
            </th>
            <th>Name</th>
            <th>createAt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FormControl componentClass='checkbox' checked={false} />
            </td>
            <td>shit</td>
            <td>Today,</td>
          </tr>
        </tbody>
      </Table>
    );
  };

  render() {
    const updatedProps = {
      title: 'List Assets',
      rightActionBar: this.renderRightActionBar,
      content: this.renderContent(),
      sidebar: <SideBar />
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
