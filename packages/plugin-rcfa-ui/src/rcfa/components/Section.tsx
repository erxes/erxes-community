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
  Divider,
  ListItem,
  ItemBtn,
  StyledListItem
} from '../../styles';
import ResolverModal from './ResolverModal';
import _loadsh from 'lodash';
import { LinkButton, ModalFooter } from '@erxes/ui/src/styles/main';

interface IRCFAIssues extends IRCFA {
  editing?: boolean;
  issue: string;
}

type Props = {
  issues: IRCFAIssues[];
  detail: IRCFAIssues;
  addIssue: (data) => void;
  editIssue: (_id: string, question: string) => void;
  removeIssue: (_id: string) => void;
  mainTypeId: string;
  mainType: string;
};

type State = {
  issues: any[];
};

class RCFASection extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      issues: props.issues || []
    };
  }

  componentDidMount() {
    if (
      _loadsh.isEmpty(this.props.detail || {}) &&
      !this.state?.issues?.length
    ) {
      this.setState({
        issues: [{ issue: '', _id: Math.random(), editing: true }]
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.issues) !== JSON.stringify(this.props.issues)
    ) {
      this.setState({ issues: this.props.issues });
    }
  }

  handleSave({ _id, value }: { _id?: string; value: string }) {
    const { detail, editIssue, addIssue } = this.props;

    if (!_loadsh.isEmpty(detail) && typeof _id === 'string') {
      return editIssue(_id, value);
    }

    addIssue({ issue: value });
  }

  renderResolveForm(callback) {
    const { mainType, mainTypeId } = this.props;

    const trigger = <Button btnStyle="success">{__('Done')}</Button>;

    const resolverContent = ({ closeModal }) => {
      return (
        <ResolverModal
          mainType={mainType}
          mainTypeId={mainTypeId}
          closeModal={closeModal}
          callback={callback}
        />
      );
    };

    return (
      <ModalTrigger
        title="Create related card"
        content={resolverContent}
        style={{ overflow: 'auto' }}
        trigger={trigger}
      />
    );
  }

  renderForm() {
    const { removeIssue, detail } = this.props;
    const { issues } = this.state;

    let icon = 'plus-circle';

    if (!_loadsh.isEmpty(detail)) {
      icon = 'edit-alt';
      if (detail.status !== 'inProgress') {
        icon = 'search';
      }
    }

    const trigger = (
      <Button btnStyle="simple">
        <Icon icon={icon} />
      </Button>
    );

    const content = ({ closeModal }) => {
      const onChangeIssue = (e, _id) => {
        const { value } = e.currentTarget as HTMLInputElement;

        const updateIssues = issues.map(issue =>
          issue._id === _id ? { ...issue, issue: value } : issue
        );

        this.setState({ issues: updateIssues });
      };

      const handleSaveIssue = (e, _id) => {
        if (e.key === 'Enter') {
          const { value } = e.currentTarget as HTMLInputElement;

          this.handleSave({ _id, value });

          const updatedIssues = issues.map(issue =>
            issue._id === _id ? { ...issue, editing: !issue.editing } : issue
          );

          this.setState({ issues: updatedIssues });
        }
      };

      const toggleEdit = _id => {
        const updatedIssues = issues.map(issue =>
          issue._id === _id ? { ...issue, editing: !issue.editing } : issue
        );
        this.setState({ issues: updatedIssues });
      };

      const handleAddIssue = () => {
        this.setState({
          issues: [...issues, { issue: '', _id: Math.random(), editing: true }]
        });
      };

      const handleRemoveIssue = _id => {
        confirm().then(() => {
          removeIssue(_id);
        });

        const updatedIssues = issues.filter(issue => issue._id !== _id);

        this.setState({ issues: updatedIssues });
      };

      return (
        <div>
          {issues.map((issue, index) => (
            <StyledListItem key={issue._id}>
              <FormGroup>
                <ControlLabel>{`Issue ${index + 1}`}</ControlLabel>
                {issue.editing ? (
                  <FormControl
                    type="text"
                    value={issue?.issue}
                    onChange={e => onChangeIssue(e, issue._id)}
                    onKeyPress={e => handleSaveIssue(e, issue._id)}
                  />
                ) : (
                  <ListItem>
                    <ControlLabel>{issue.issue}</ControlLabel>
                    <BarItems>
                      <ItemBtn color={colors.colorCoreGray}>
                        <Icon
                          icon="edit"
                          onClick={toggleEdit.bind(this, issue._id)}
                        />
                      </ItemBtn>
                      <ItemBtn
                        color={colors.colorCoreRed}
                        onClick={handleRemoveIssue.bind(this, issue._id)}
                      >
                        <Icon icon="times-circle" />
                      </ItemBtn>
                    </BarItems>
                  </ListItem>
                )}
              </FormGroup>
              {issues?.length !== index + 1 && (
                <Divider>
                  <span>{'Why ?'}</span>
                </Divider>
              )}
            </StyledListItem>
          ))}
          {detail?.status === 'inProgress' && (
            <LinkButton onClick={handleAddIssue}>{__('Add Issue')}</LinkButton>
          )}
          <ModalFooter>
            <Button onClick={closeModal} btnStyle="simple">
              {__('Cancel')}
            </Button>
            {detail?.status === 'inProgress' &&
              this.renderResolveForm(closeModal)}
          </ModalFooter>
        </div>
      );
    };

    return <ModalTrigger title="RCFA" trigger={trigger} content={content} />;
  }

  render() {
    const { detail } = this.props;
    const { issues } = this.props;

    const extraButtons = <BarItems>{this.renderForm()}</BarItems>;

    return (
      <Box title="RCFA" name="name" extraButtons={extraButtons} isOpen>
        <StyledContent>
          {!_loadsh.isEmpty(detail || {}) && issues.length > 0 ? (
            <p>{issues[issues?.length - 1]?.issue}</p>
          ) : (
            <p>No questions there.</p>
          )}
        </StyledContent>
      </Box>
    );
  }
}

export default RCFASection;
