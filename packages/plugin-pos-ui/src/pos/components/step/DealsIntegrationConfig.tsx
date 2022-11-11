import PerConfigs from '../dealGroup/PerConfigs';
import React from 'react';
import {
  AppearanceRow,
  Block,
  FlexColumn,
  FlexItem,
  FlexRow
} from '../../../styles';
import { Button, ControlLabel, FormGroup } from '@erxes/ui/src/components';
import BoardSelectContainer from '@erxes/ui-cards/src/boards/containers/BoardSelect';
import { Alert, __ } from '@erxes/ui/src/utils';
import { IConfigsMap } from '../../../types';
import { IPos } from '../../../types';
import { LeftItem } from '@erxes/ui/src/components/step/styles';

type Props = {
  onChange: (name: 'dealsIntegrationConfig', value: any) => void;
  pos?: IPos;
};
type State = {
  configsMap: IConfigsMap;
};
class DealsIntegrationConfig extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let configsMap =
      props.pos && props.pos.dealsIntegrationConfig
        ? props.pos.dealsIntegrationConfig
        : {
            forCheckDeals: null,
            forCreateDeal: {
              boardId: '',
              pipelineId: '',
              stageId: ''
            }
          };
    if (!configsMap.forCheckDeals) {
      configsMap.forCreateDeal = {
        boardId: '',
        pipelineId: '',
        stageId: ''
      };
    }
    this.state = {
      configsMap: configsMap
    };
  }
  add = e => {
    e.preventDefault();
    const { configsMap } = this.state;

    if (!configsMap?.forCheckDeals) {
      configsMap.forCheckDeals = {};
    }

    configsMap.forCheckDeals.newDealsIntegrationConfig = {
      boardId: '',
      pipelineId: '',
      stageId: ''
    };
    this.setState({ configsMap });
  };
  delete = (currentConfigKey: string) => {
    const { configsMap } = this.state;
    delete configsMap.forCheckDeals[currentConfigKey];
    delete configsMap.forCheckDeals['newDealsConfig'];

    this.setState({ configsMap });

    this.props.onChange('dealsIntegrationConfig', configsMap);
    Alert.success('You successfully deleted stage in deals settings.');
  };
  renderContent(configs) {
    return Object.keys(configs).map(key => {
      return (
        <PerConfigs
          key={Math.floor(Math.random() * 10000000) + 1}
          configsMap={this.state.configsMap}
          config={configs[key]}
          currentConfigKey={key}
          save={this.props.onChange}
          delete={this.delete}
        />
      );
    });
  }

  onChangeCreateConfig = (code: string, value) => {
    const { configsMap } = this.state;
    configsMap.forCreateDeal[code] = value;

    this.setState({ configsMap });
  };
  renderCollapse() {
    const { configsMap } = this.state;
    const mapping = configsMap.forCheckDeals || {};
    const actionButtons = (
      <Button
        btnStyle="primary"
        onClick={this.add}
        icon="plus"
        uppercase={false}
      >
        Add Stage
      </Button>
    );

    const onChangeBoard = (boardId: string) => {
      this.onChangeCreateConfig('boardId', boardId);
    };

    const onChangePipeline = (pipelineId: string) => {
      this.onChangeCreateConfig('pipelineId', pipelineId);
    };

    const onChangeStage = (stageId: string) => {
      this.onChangeCreateConfig('stageId', stageId);
    };

    return (
      <FlexRow>
        <LeftItem>
          <Block>
            <h4>For creating new deal</h4>
            <FormGroup>
              <ControlLabel>Choose Stage</ControlLabel>
              <BoardSelectContainer
                type="deal"
                autoSelectStage={false}
                boardId={configsMap.forCreateDeal['boardId']}
                pipelineId={configsMap.forCreateDeal['pipelineId']}
                stageId={configsMap.forCreateDeal['stageId']}
                onChangeBoard={onChangeBoard}
                onChangePipeline={onChangePipeline}
                onChangeStage={onChangeStage}
              />
            </FormGroup>
          </Block>
          <Block>
            <h4>For checking deals</h4>
            {actionButtons}
            <br />
            <br />
            {this.renderContent(mapping)}
          </Block>
        </LeftItem>
      </FlexRow>
    );
  }
  render() {
    return (
      <FlexItem>
        <FlexColumn>
          <LeftItem>
            <Block>{this.renderCollapse()}</Block>
          </LeftItem>
        </FlexColumn>
      </FlexItem>
    );
  }
}
export default DealsIntegrationConfig;
