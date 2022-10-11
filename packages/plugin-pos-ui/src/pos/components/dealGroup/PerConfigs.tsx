import {
  Button,
  CollapseContent,
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components';
import BoardSelectContainer from '@erxes/ui-cards/src/boards/containers/BoardSelect';
import { Alert, __ } from '@erxes/ui/src/utils';
import { MainStyleModalFooter as ModalFooter } from '@erxes/ui/src/styles/eindex';
import React from 'react';
import { IConfigsMap } from '../../../../../plugin-ebarimt-ui/src/types';

type Props = {
  configsMap: IConfigsMap;
  config: any;
  currentConfigKey: string;
  save: (name: 'dealsIntegrationConfig', value: any) => void;
  delete: (currentConfigKey: string) => void;
};

type State = {
  config: any;
  hasOpen: boolean;
};

class PerConfigs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      config: props.config,
      hasOpen: false
    };
  }

  onChangeBoard = (boardId: string) => {
    this.setState({ config: { ...this.state.config, boardId } });
  };

  onChangePipeline = (pipelineId: string) => {
    this.setState({ config: { ...this.state.config, pipelineId } });
  };

  onChangeStage = (stageId: string) => {
    this.setState({ config: { ...this.state.config, stageId } });
  };

  onSave = e => {
    e.preventDefault();
    const { configsMap, currentConfigKey } = this.props;
    const { config } = this.state;
    const key = Math.floor(Math.random() * 1000000 + 1);

    delete configsMap.forCheckDeals[currentConfigKey];
    configsMap.forCheckDeals[key] = config;
    this.props.save('dealsIntegrationConfig', configsMap);
    Alert.success('You successfully updated stage in deals settings.');
  };

  onDelete = e => {
    e.preventDefault();

    this.props.delete(this.props.currentConfigKey);
  };

  onChangeConfig = (code: string, value) => {
    const { config } = this.state;
    config[code] = value;
    this.setState({ config });
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  render() {
    const { config } = this.state;
    return (
      <CollapseContent
        title={__(config.title)}
        open={this.props.currentConfigKey === 'newDealsConfig' ? true : false}
      >
        <FormGroup>
          <ControlLabel>{'Title'}</ControlLabel>
          <FormControl
            defaultValue={config['title']}
            onChange={this.onChangeInput.bind(this, 'title')}
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Choose Stage</ControlLabel>
          <BoardSelectContainer
            type="deal"
            autoSelectStage={false}
            boardId={config.boardId}
            pipelineId={config.pipelineId}
            stageId={config.stageId}
            onChangeBoard={this.onChangeBoard}
            onChangePipeline={this.onChangePipeline}
            onChangeStage={this.onChangeStage}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            icon="cancel-1"
            onClick={this.onDelete}
            uppercase={false}
          >
            Delete
          </Button>

          <Button
            btnStyle="primary"
            icon="check-circle"
            onClick={this.onSave}
            uppercase={false}
            disabled={config.stageId ? false : true}
          >
            Save
          </Button>
        </ModalFooter>
      </CollapseContent>
    );
  }
}
export default PerConfigs;
