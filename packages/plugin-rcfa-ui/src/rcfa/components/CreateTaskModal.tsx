import React from 'react';
import BoardSelect from '@erxes/ui-cards/src/boards/containers/BoardSelect';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components/form';
import Select from 'react-select-plus';
import Button from '@erxes/ui/src/components/Button';
import { withProps } from '@erxes/ui/src/utils/core';
import { graphql } from 'react-apollo';
import { mutations } from '../graphql';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';

type Props = {
  rcfaCreateRelatedTask: Function;
  ticketId: string;
  closeModal: Function;
};

type State = {
  type: string;
  stageId: string;
  pipelineId: string;
  boardId: string;
  name: string;
  onChangeStage?: ((stageId: string) => void) | undefined;
  onChangePipeline: ((pipelineId: string, stages: any) => void) | undefined;
  onChangeBoard: ((boardId: string) => void) | undefined;
};

class rcfaCreateTaskModal extends React.Component<Props, State> {
  state: {
    type: string;
    stageId: string;
    pipelineId: string;
    boardId: string;
    name: string;
    onChangeStage?: (stageId: string) => void;
    onChangePipeline: (pipelineId: string, stages: any) => void;
    onChangeBoard: (boardId: string) => void;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      type: 'task',
      stageId: '',
      pipelineId: '',
      boardId: '',
      name: '',
      onChangeBoard(boardId: string): void {},
      onChangePipeline(pipelineId: string, stages: any): void {},
      onChangeStage(stageId: string): void {}
    };
  }

  render() {
    const { rcfaCreateRelatedTask } = this.props;

    const options = [
      { value: 'task', label: 'Task' },
      { value: 'deal', label: 'Deal' }
    ];

    const onChange = (event: any) => {
      this.setState({ type: event.value });
    };

    const onChangeBoard = (boardId: string) => {
      this.setState({ boardId: boardId });
    };

    const onChangePipeline = (value: any) => {
      this.setState({ pipelineId: value });
    };

    const onChangeStage = (stageId: string) => {
      this.setState({ stageId: stageId });
    };

    const create = async () => {
      const stageId = this.state.stageId;
      const pipelineId = this.state.pipelineId;
      const boardId = this.state.boardId;
      const name = this.state.name;

      if (!stageId || !pipelineId || !boardId || !name) {
        return;
      }

      const payload = {
        type: this.state.type,
        sourceType: 'ticket',
        itemId: this.props.ticketId,
        name: this.state.name,
        stageId: this.state.stageId
      };

      await rcfaCreateRelatedTask({ variables: payload });

      this.props.closeModal();
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Type</ControlLabel>
          <Select
            isRequired={true}
            placeholder="Choose a type"
            value={this.state.type}
            onChange={onChange}
            options={options}
            clearable={false}
          />
        </FormGroup>

        <BoardSelect
          type={this.state.type}
          stageId={this.state.stageId}
          pipelineId={this.state.pipelineId}
          boardId={this.state.boardId}
          onChangeStage={onChangeStage}
          onChangePipeline={onChangePipeline}
          onChangeBoard={onChangeBoard}
        />

        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            required
            onChange={(e: any) => {
              this.setState({ name: e.target.value });
            }}
          />
        </FormGroup>

        <Button onClick={create}>Done</Button>
      </>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.rcfaCreateRelatedTask), {
      name: 'rcfaCreateRelatedTask'
    })
  )(rcfaCreateTaskModal)
);
