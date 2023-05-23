import React from 'react';
import {
  BarItems,
  Box,
  Icon,
  ModalTrigger,
  Button,
  FormControl,
  __,
  confirm,
  FormGroup,
  ControlLabel,
  colors
} from '@erxes/ui/src/';
import { IRCFA } from '../../../../plugin-rcfa-api/src/models/definitions/rcfa';
import {
  StyledContent,
  StyledQuestionItem,
  ListItem,
  ItemBtn
} from '../../styles';
import CreateTaskModal from './CreateTaskModal';

interface IRCFAQuestions extends IRCFA {
  editing?: boolean;
  issue: string;
}

type Props = {
  issues: IRCFAQuestions[];
  createQuestion: (question: string, parentId: string | null) => void;
  editQuestion: (_id: string, question: string) => void;
  deleteQuestion: (_id: string) => void;
  ticketId: string;
};

type State = {
  issues: any[];
  showQuestion: boolean;
  newQuestion: string;
};

class RCFASection extends React.Component<Props, State> {
  // state: { questions: IRCFAQuestions[]; showQuestion: true; newQuestion: '' };

  constructor(props) {
    super(props);

    console.log({ issues: props.issues });

    this.state = {
      // questions: props.questions || [],
      issues: props.issues || [],
      showQuestion: true,
      newQuestion: ''
    };
  }

  // componentWillReceiveProps(prevProps) {
  //   const questions: any = [];
  //   for (const question of prevProps.questions) {
  //     questions.push({ editing: false, ...question });
  //   }
  //   this.setState({ questions: questions });
  // }

  componentDidMount() {
    if (!this.state?.issues?.length) {
      this.setState({
        issues: [{ value: '', _id: Math.random(), editing: true }]
      });
    }
  }

  // addQuestion = () => {
  //   const { issues } = this.state;

  //   if (issues.length >= 5) {
  //     return;
  //   } else {
  //     this.setState({ showQuestion: true });
  //   }
  // };

  // writeQuestion = (index: number) => event => {
  //   const {issues} = this.state;
  //   issues[index].issue = event.target.value;
  //   this.setState({ issues });
  // };

  // editQuestion = (_id: string | undefined, index: number) => () => {
  //   const { issues } = this.state
  //   issues[index].editing = !issues[index].editing;
  //   this.setState({ issues });
  // };

  saveEditedQuestion = (index: number) => () => {
    let question = this.state.issues[index];
    this.props.editQuestion(question._id as string, question.issue);
  };

  // onChangeQuestion = (index: number) => (event: any) => {
  //   let questList = this.state.questions;
  //   questList[index].issue = event.target.value;
  //   this.setState({ questions: questList });
  // };

  // cancelEdit = (index: number) => () => {
  //   const { questions } = this.state;

  //   let questList = this.state.questions;
  //   questList[index].issue = questions[index].issue;
  //   questList[index].editing = false;
  //   this.setState({ questions: questList });
  // };

  // deleteModalTrigger = (_id: string) => () => {
  //   confirm().then(() => {
  //     this.props.deleteQuestion(_id);
  //   });
  //   this.setState({ newQuestion: '' });
  // };

  createQuestion = (_id, value) => {
    // const parentId = this

    this.props.createQuestion(value, null);
    // if (this.state.newQuestion) {
    //   let parentId: string | null = null;

    //   const questions = this.state.questions;

    //   if (this.state.questions.length > 0) {
    //     parentId = questions[questions.length - 1]._id as string;
    //   }

    //   this.props.createQuestion(this.state.newQuestion, parentId);
    //   this.setState({ showQuestion: false });
    // }
  };

  renderForm() {
    const { issues } = this.state;

    const trigger = (
      <Button btnStyle="simple">
        <Icon icon="plus-circle" />
      </Button>
    );

    const content = ({ closeModal }) => {
      const { issues } = this.state;

      const onChangeIssue = (e, _id) => {
        const { value } = e.currentTarget as HTMLInputElement;

        const updateIssues = issues.map(issue =>
          issue._id === _id ? { ...issue, value } : issue
        );

        this.setState({ issues: updateIssues });
      };

      const handleSaveIssue = (e, _id) => {
        if (e.key === 'Enter') {
          const { value } = e.currentTarget as HTMLInputElement;

          const updatedIssues = issues.map(issue =>
            issue._id === _id ? { ...issue, editing: !issue.editing } : issue
          );

          this.setState({ issues: updatedIssues });
          this.createQuestion(_id, value);
          // this.props.onSearch(target.value || '');
        }
      };

      return (
        <div>
          {issues.map((issue, index) => (
            <StyledQuestionItem key={index}>
              <FormGroup>
                <ControlLabel>{`Issue ${index + 1}`}</ControlLabel>
                {issue.editing ? (
                  <FormControl
                    type="text"
                    value={issue?.value}
                    onChange={e => onChangeIssue(e, issue._id)}
                    onKeyPress={e => handleSaveIssue(e, issue._id)}
                  />
                ) : (
                  <ListItem>
                    <ControlLabel>{issue.value}</ControlLabel>
                    <BarItems>
                      <ItemBtn color={colors.colorCoreGray}>
                        <Icon icon="edit" />
                      </ItemBtn>
                      <ItemBtn color={colors.colorCoreRed}>
                        <Icon icon="times-circle" />
                      </ItemBtn>
                    </BarItems>
                  </ListItem>
                )}
              </FormGroup>
              {/* {question.editing ? (
                <FormGroup>
                  <ControlLabel>{`Issue ${index +1}`}</ControlLabel>
                  <FormControl
                    type="text"
                    value={question.issue}
                    onChange={this.onChangeQuestion(index)}
                    onKeyPress={e => console.log(e)}
                  />
                </FormGroup>
              ) : (
                <p
                  style={{ marginTop: '0.4375rem', marginBottom: '0.9375rem' }}
                >
                  {question.issue}
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
              </div> */}
            </StyledQuestionItem>
          ))}

          {/* {this.state.showQuestion || questions.length === 0 ? (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ marginBottom: 0 }}>
                  {__('Question')} {questions.length + 1}:
                </p>
                {questions.length !== 0 ? (
                  <Icon
                    icon="times"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.setState({ showQuestion: false });
                    }}
                  />
                ) : (
                  ''
                )}
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
          )} */}

          {/* <div style={{ textAlign: 'right' }}>
            {!this.state.showQuestion || questions.length >= 5 ? (
              <Button
                btnStyle="simple"
                onClick={this.addQuestion}
                disabled={questions.length >= 5}
              >
                <Icon icon="plus-circle" /> Add question
              </Button>
            ) : (
              ''
            )}

            {this.createTask()}
            {questions.length === 0 ? (
              <Button onClick={closeModal}>Done1</Button>
            ) : (
              ''
            )}
          </div> */}
        </div>
      );
    };

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const { issues } = this.state;

    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <Box title="RCFA" name="name" extraButtons={extraButtons} isOpen>
        <StyledContent>
          {issues.length > 0 ? (
            <p>{issues[0]?.value}</p>
          ) : (
            <p>No questions there.</p>
          )}
        </StyledContent>
      </Box>
    );
  }

  triggerNew() {
    if (this.state.issues.length > 0) {
      return <Button>Done2</Button>;
    } else {
      return <></>;
    }
  }

  createTask() {
    const taskContent = ({ closeModal }) => {
      return (
        <CreateTaskModal
          ticketId={this.props.ticketId}
          rcfaCreateRelatedTask={() => {}}
          closeModal={closeModal}
        />
      );
    };

    return (
      <ModalTrigger
        title="Create related card"
        content={taskContent}
        style={{ overflow: 'auto' }}
        trigger={this.triggerNew()}
      />
    );
  }
}

export default RCFASection;
