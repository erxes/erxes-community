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
import { StyledContent, StyledQuestionItem } from '../../styles';

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

  deleteModalContent = props => {
    return (
      <div>
        <h4>Are you sure delete?</h4>
        {/* <p>{props.title}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button btnStyle="simple">Cancel</Button>
          <Button btnStyle="danger">Delete</Button>
        </div> */}
      </div>
    );
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="plus-circle" />
      </Button>
    );

    const deleteModalTrigger = (_id: string | undefined, title: string) => (
      <Button btnStyle="danger" size="small">
        <Icon icon="times-circle" /> Delete
      </Button>
    );

    const content = () => {
      return (
        <div>
          {this.state.questions.map((question, index) => (
            <StyledQuestionItem key={index}>
              <p>
                {__('Question')} {index + 1}:
              </p>
              <p>{question.title}</p>

              <Button
                btnStyle="simple"
                size="small"
                onClick={this.editQuestion(question._id)}
              >
                <Icon icon="edit-alt" /> Edit
              </Button>

              {deleteModalTrigger(question._id, question.title)}
            </StyledQuestionItem>
          ))}

          <div style={{ textAlign: 'right' }}>
            <Button
              btnStyle="simple"
              onClick={this.addQuestion}
              disabled={this.state.questions.length >= 5}
            >
              <Icon icon="plus-circle" /> Add question
            </Button>
            <Button onClick={this.saveQuestion}>
              <Icon icon="check-circle" /> Done
            </Button>
          </div>
        </div>
      );
    };

    <ModalTrigger
      title="delete question"
      trigger={deleteModalTrigger}
      content={this.deleteModalContent}
    />;

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <Box title="RCFA" name="name" extraButtons={extraButtons} isOpen>
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
