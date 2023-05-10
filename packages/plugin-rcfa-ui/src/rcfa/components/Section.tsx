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
import { IRCFAQuestions } from '../../../../plugin-rcfa-api/src/models/definitions/rcfa';
import { StyledContent } from '../../styles';

type Props = {
  questions: IRCFAQuestions[];
  createQuestion: (doc: any) => void;
  editQuestion: (_id: string, title: string) => void;
  deleteQuestion: (_id: string) => void;
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

  componentWillReceiveProps(prevProps) {
    this.setState({ questions: prevProps.questions });
  }

  saveQuestion = () => {
    this.props.createQuestion('title');
  };

  addQuestion = () => {
    if (this.props.questions.length >= 5) {
      console.log('reached max questions');
      return;
    }
  };

  writeQuestion = (index: number) => event => {
    console.log(index, event.target.value);
    let questList = this.state.questions;
    questList[index].title = event.target.value;
    this.setState({ questions: questList });
  };

  editQuestion = (_id: string | undefined) => () => {
    if (_id) {
      this.props.editQuestion(_id, 'hello world');
    }
  };

  deleteQuestion = (_id: string | undefined) => () => {
    if (_id) {
      this.props.deleteQuestion(_id);
    }
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="plus-circle" />
      </Button>
    );

    const content = () => {
      return (
        <div>
          {this.state.questions.map((question, index) => (
            <div key={index}>
              <FormGroup>
                <ControlLabel>
                  {__('Question')} {index + 1}
                </ControlLabel>
                <FormControl
                  type="text"
                  value={question.title}
                  onChange={this.writeQuestion(index)}
                />
                <br />
                <Button
                  btnStyle="simple"
                  size="small"
                  onClick={this.editQuestion(question._id)}
                >
                  Save
                </Button>
                <Button
                  btnStyle="danger"
                  size="small"
                  onClick={this.deleteQuestion(question._id)}
                >
                  Delete
                </Button>
              </FormGroup>
            </div>
          ))}

          <Button btnStyle="simple" onClick={this.saveQuestion}>
            Done
          </Button>
          <Button
            onClick={this.addQuestion}
            disabled={this.state.questions.length >= 5}
          >
            Add Question
          </Button>
        </div>
      );
    };

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <Box title="RCFA" name="name" extraButtons={extraButtons}>
        <StyledContent>
          {this.props.questions.length > 0 ? (
            <p>{this.props.questions[0]?.title}</p>
          ) : (
            <p>No questions there.</p>
          )}
        </StyledContent>
      </Box>
    );
  }
}

export default Section;
