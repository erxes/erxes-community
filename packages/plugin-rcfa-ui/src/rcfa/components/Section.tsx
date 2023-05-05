import React from 'react';
import {
  BarItems,
  Box,
  Icon,
  ModalTrigger,
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  __
} from '@erxes/ui/src/';
import { ButtonMutate } from '@erxes/ui/src';

type Props = {};

type State = {
  searchValue?: string;
};

class Section extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderForm() {
    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="plus-circle" />
      </Button>
    );

    const saveQuestion = () => {};

    const content = props => {
      return (
        <div>
          <FormGroup>
            <ControlLabel>{__('Question 1')}</ControlLabel>
            <FormControl type="text"></FormControl>
          </FormGroup>
          <Button btnStyle="simple">Done</Button>
          <Button onClick={saveQuestion}>Why</Button>
        </div>
      );
    };

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <div className="">
        <Box title="RCFA" name="name" extraButtons={extraButtons}>
          <p>
            Larry the Bird. Larry Joe Bird (born December 7, 1956) is an
            American former professional basketball player, coach and executive
            in the National Basketball Association (NBA).
          </p>
        </Box>
      </div>
    );
  }
}

export default Section;
