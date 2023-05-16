import React from 'react';
import BoardSelect from '@erxes/ui-cards/src/boards/containers/BoardSelect';
import { ControlLabel, FormGroup } from '@erxes/ui/src/components/form';
import Select from 'react-select-plus';
import TicketConvertTrigger from '@erxes/ui-cards/src/tickets/components/TicketConvertTrigger';
import DealConvertTrigger from '@erxes/ui-cards/src/deals/components/DealConvertTrigger';
import TaskConvertTrigger from '@erxes/ui-cards/src/tasks/components/TaskConvertTrigger';

// sample
// import ConvertTo from '../../../../plugin-inbox-ui/src/inbox/components/conversationDetail/workarea/ConvertTo';

type Props = {};

type State = {
  type: string;
  stageId: string;
  pipelineId: string;
  boardId: string;
  onChangeStage?: ((stageId: string) => void) | undefined;
  onChangePipeline: ((pipelineId: string, stages: any) => void) | undefined;
  onChangeBoard: ((boardId: string) => void) | undefined;
};

class CreateTaskModal extends React.Component<Props, State> {
  state: {
    type: string;
    stageId: string;
    pipelineId: string;
    boardId: string;
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
      onChangeBoard(boardId: string): void {},
      onChangePipeline(pipelineId: string, stages: any): void {},
      onChangeStage(stageId: string): void {}
    };
  }

  render() {
    const options = [
      { value: 'task', label: 'Task' },
      { value: 'deal', label: 'Deal' }
    ];

    const onChange = (event: any) => {
      this.setState({ type: event.value });
    };

    const onChangeBoard = (boardId: string) => {
      console.log('onChangeBoard', boardId);
      this.setState({ boardId: boardId });
    };

    const onChangePipeline = (value: any) => {
      console.log('onChangePipeline', value);
      this.setState({ pipelineId: value });
    };

    const onChangeStage = (stageId: string) => {
      console.log('onChangeStage', stageId);
      this.setState({ stageId: stageId });
    };

    const refetch = (): void => {};

    const triggerProps: any = {
      assignedUserIds: 'id',
      relTypeIds: 'customerIds',
      relType: 'customer',
      sourceConversationId: 'id',
      subject: '',
      refetch: refetch
    };

    const url = 'url';

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

        {this.state.type === 'task' ? (
          <TaskConvertTrigger {...triggerProps} />
        ) : (
          <DealConvertTrigger {...triggerProps} bookingProductId={url} />
        )}
        {/* <TicketConvertTrigger relType="" refetch={refetch} /> */}
      </>
    );
  }
}

export default CreateTaskModal;
