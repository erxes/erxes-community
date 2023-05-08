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

type Props = {};

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
    console.log('**********************************');
    const questions: any = queries.getQuestions;
    console.log(questions);
    console.log('**********************************');

    const result: IRCFAQuestions[] = [
      {
        _id: 'bQZMT7FtTLc3twrC5',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T08:38:39.043Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      }
    ];

    this.setState({ questions: result });
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
          {this.state.questions.length > 0 ? (
            <p>{this.state.questions[0]?.title}</p>
          ) : (
            <p>No questions there.</p>
          )}
        </Box>
      </div>
    );
  }
}

export default Section;
