import React from 'react';
// import BoardSelect from '@erxes/ui-cards/src/boards/containers/BoardSelect';
import BoardSelect from '@erxes/ui-cards/src/boards/components/BoardSelect';

type Props = {};

type State = {
  type: string;
  stageId: string;
  pipelineId: string;
  boardId: string;
  onChangeStage?: (stageId: string) => void;
  onChangePipeline: (pipelineId: string, stages: any) => void;
  onChangeBoard: (boardId: string) => void;
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

    // this.state = {
    //   type: 'ticket',
    //   stageId: '1',
    //   pipelineId: '1',
    //   boardId: '1'
    // };
  }

  render() {
    return (
      <>
        <p>Task modal</p>
        <BoardSelect
          type="ticket"
          stageId="1"
          pipelineId="1"
          boardId="1"
          onChangeStage="1"
          onChangePipeline="1"
          onChangeBoard="1"
        />
      </>
    );
  }
}

export default CreateTaskModal;
