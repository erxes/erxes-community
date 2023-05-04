import React from 'react';
import { BarItems, Box, Icon, ModalTrigger, Button } from '@erxes/ui/src/';

type Props = {};

type State = {
  searchValue?: string;
};

class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderForm() {
    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="add" />
      </Button>
    );

    const content = props => {
      return (
        <div>
          test
          <p>input bna</p>
          <p>2button bna Done, Why </p>
          <p>done -darval save hiigeed modal haagdana</p>
        </div>
      );
    };

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <>
        <div className="">
          <Box title="RCFA" name="name" extraButtons={extraButtons}>
            <p>
              Larry the Bird. Larry Joe Bird (born December 7, 1956) is an
              American former professional basketball player, coach and
              executive in the National Basketball Association (NBA).
            </p>
          </Box>
        </div>
      </>
    );
  }
}

export default List;
