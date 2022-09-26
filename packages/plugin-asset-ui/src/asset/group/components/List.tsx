import { Box, Button, ModalTrigger } from '@erxes/ui/src';
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

  renderFormContent = props => {
    return <Form {...props} />;
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
      <ContainerBox gap={15} column>
        {this.renderAddForm()}
        <Box title=' Groups'>shit</Box>
      </ContainerBox>
    );
  }
}

export default List;
