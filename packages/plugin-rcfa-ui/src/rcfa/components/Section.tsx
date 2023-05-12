import React from 'react';
import {
  BarItems,
  Box,
  Icon,
  ModalTrigger,
  Button,
  FormControl,
  __,
  confirm
} from '@erxes/ui/src/';
import { IRCFAQuestions as IRFCA } from '../../../../plugin-rcfa-api/src/models/definitions/rcfa';
import { StyledContent, StyledQuestionItem } from '../../styles';
import CreateTaskModal from './CreateTaskModal';

interface IRCFAQuestions extends IRFCA {
  editing: boolean;
}

type Props = {
  questions: IRCFAQuestions[];
  createQuestion: (doc: any) => void;
  editQuestion: (_id: string, title: string) => void;
  deleteQuestion: (_id: string) => void;
};

type State = {
  questions: IRCFAQuestions[];
  showQuestion: boolean;
  newQuestion: string;
};

class Section extends React.Component<Props, State> {
  state: { questions: IRCFAQuestions[]; showQuestion: false; newQuestion: '' };

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      showQuestion: false,
      newQuestion: ''
    };
  }

  componentWillReceiveProps(prevProps) {
    const questions: any = [];
    for (const question of prevProps.questions) {
      questions.push({ editing: false, ...question });
    }
    this.setState({ questions: questions });
  }

  addQuestion = () => {
    if (this.props.questions.length >= 5) {
      console.log('reached max questions');
      return;
    } else {
      this.setState({ showQuestion: true });
    }
  };

  writeQuestion = (index: number) => event => {
    let questList = this.state.questions;
    questList[index].title = event.target.value;
    this.setState({ questions: questList });
  };

  editQuestion = (_id: string | undefined, index: number) => () => {
    let questList = this.state.questions;
    questList[index].editing = !questList[index].editing;
    this.setState({ questions: questList });
  };

  saveEditedQuestion = (index: number) => () => {
    let question = this.state.questions[index];
    this.props.editQuestion(question._id as string, question.title);
  };

  onChangeQuestion = (index: number) => (event: any) => {
    let questList = this.state.questions;
    questList[index].title = event.target.value;
    this.setState({ questions: questList });
  };

  cancelEdit = (index: number) => () => {
    let questList = this.state.questions;
    questList[index].title = this.props.questions[index].title;
    questList[index].editing = false;
    this.setState({ questions: questList });
  };

  deleteModalTrigger = (_id: string) => () => {
    confirm().then(() => {
      this.props.deleteQuestion(_id);
    });
  };

  createQuestion = () => {
    if (this.state.newQuestion) {
      this.props.createQuestion(this.state.newQuestion);
      this.setState({ showQuestion: false });
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
            <StyledQuestionItem key={index}>
              <p style={{ marginBottom: 0 }}>
                {__('Question')} {index + 1}:
              </p>
              {question.editing ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <FormControl
                    type="text"
                    value={question.title}
                    onChange={this.onChangeQuestion(index)}
                  />
                </div>
              ) : (
                <p
                  style={{ marginTop: '0.4375rem', marginBottom: '0.9375rem' }}
                >
                  {question.title}
                </p>
              )}
              <div>
                {question.editing ? (
                  <div>
                    <Button
                      btnStyle="simple"
                      size="small"
                      onClick={this.cancelEdit(index)}
                    >
                      <Icon icon="times-circle" /> Cancel
                    </Button>
                    <Button
                      size="small"
                      onClick={this.saveEditedQuestion(index)}
                    >
                      <Icon icon="times-circle" /> Save
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      btnStyle="simple"
                      size="small"
                      onClick={this.editQuestion(question._id, index)}
                    >
                      <Icon icon="edit-alt" /> Edit
                    </Button>
                    <Button
                      btnStyle="danger"
                      size="small"
                      onClick={this.deleteModalTrigger(question._id as string)}
                    >
                      <Icon icon="times-circle" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            </StyledQuestionItem>
          ))}

          {this.state.showQuestion ? (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ marginBottom: 0 }}>
                  {__('Question')} {this.props.questions.length + 1}:
                </p>
                <Icon
                  icon="times"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({ showQuestion: false });
                  }}
                />
              </div>

              <FormControl
                type="text"
                onChange={(event: any) => {
                  this.setState({ newQuestion: event.target.value });
                }}
              />
              <Button
                btnStyle="simple"
                size="small"
                style={{ marginTop: '0.5rem' }}
                onClick={this.createQuestion}
              >
                <Icon icon="edit-alt" /> Save
              </Button>
            </div>
          ) : (
            ''
          )}

          <div style={{ textAlign: 'right' }}>
            {!this.state.showQuestion || this.state.questions.length >= 5 ? (
              <Button
                btnStyle="simple"
                onClick={this.addQuestion}
                disabled={this.state.questions.length >= 5}
              >
                <Icon icon="plus-circle" /> Add question
              </Button>
            ) : (
              ''
            )}

            {this.createTask()}
          </div>
        </div>
      );
    };

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

  triggerNew = (<Button>Done</Button>);

  createTask() {
    const content = () => {
      return <CreateTaskModal />;
    };

    return (
      <ModalTrigger
        title="Create related card"
        content={content}
        style={{ overflow: 'auto' }}
        trigger={this.triggerNew}
      />
    );
  }
}

export default Section;
