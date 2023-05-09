import * as compose from 'lodash.flowright';
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
import { mutations, queries } from '../graphql';
import { IRCFAQuestions } from '../../../../plugin-rcfa-api/src/models/definitions/rcfa';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { StyledContent } from '../../styles';

type Props = {
  ticketId: string;
  questions: IRCFAQuestions[];
};

type State = {
  questions: IRCFAQuestions[];
};

class Section extends React.Component<Props, State> {
  state: { questions: IRCFAQuestions[] };

  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  saveQuestion = () => {
    const savedQuestion = gql(queries.getQuestions);
    console.log({ savedQuestion });
    // mutations.createQuestion(this.state.questions[0]);
  };

  getQuestions = () => {
    this.setState({ questions: [] });
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="plus-circle" />
      </Button>
    );

    const content = props => {
      return (
        <div>
          <FormGroup>
            <ControlLabel>{__('Question 1')}</ControlLabel>
            <FormControl type="text"></FormControl>
          </FormGroup>

          <Button btnStyle="simple" onClick={this.saveQuestion}>
            Done
          </Button>
          <Button onClick={this.saveQuestion}>Why</Button>
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
          <StyledContent>
            {this.props.questions.length > 0 ? (
              <p>{this.props.questions[0]?.title}</p>
            ) : (
              <p>No questions there.</p>
            )}
          </StyledContent>
        </Box>
      </div>
    );
  }
}

export default Section;
