import { Box, Button, ModalTrigger, Sidebar } from '@erxes/ui/src';
import React from 'react';
import { ContainerBox } from '../../../style';
import Form from '../containers/Form';

type Props = {};

class List extends React.Component<Props> {
  addFormTrigger = (
    <Button btnStyle='success' icon='plus-circle' block>
      Add Group
    </Button>
  );

  renderFormContent = () => {
    return <Form />;
  };

  renderAddForm() {
    return (
      <ModalTrigger
        title='Add Asset Group'
        trigger={this.addFormTrigger}
        content={this.renderFormContent}
      />
    );
  }

  render() {
    return (
      <Sidebar wide>
        <ContainerBox gap={15} column horizontal vertical>
          {this.renderAddForm()}
          <Box title=' Groups'>shit</Box>
        </ContainerBox>
      </Sidebar>
    );
  }
}

export default List;
