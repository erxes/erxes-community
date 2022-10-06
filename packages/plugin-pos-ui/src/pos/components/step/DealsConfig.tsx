import PerConfigs from '../dealGroup/PerConfigs';
import React from 'react';
import { __, Alert, Button } from '@erxes/ui/src';
import { Block, FlexColumn, FlexItem, FlexRow } from '../../../styles';
import { IConfigsMap } from '../../../types';
import { IPos } from '../../../types';
import { LeftItem } from '@erxes/ui/src/components/step/styles';

type Props = {
  onChange: (name: 'dealsConfig', value: any) => void;
  pos?: IPos;
};
type State = {
  configsMap: IConfigsMap;
};
class DealsConfig extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const configsMap =
      props.pos && props.pos.dealsConfig
        ? props.pos.dealsConfig
        : {
            dealsConfig: null
          };
    this.state = {
      configsMap: configsMap
    };
  }
  add = e => {
    e.preventDefault();
    const { configsMap } = this.state;

    if (!configsMap?.dealsConfig) {
      configsMap.dealsConfig = {};
    }

    configsMap.dealsConfig.newDealsConfig = {
      boardId: '',
      pipelineId: '',
      stageId: ''
    };
    this.setState({ configsMap });
  };
  delete = (currentConfigKey: string) => {
    const { configsMap } = this.state;
    delete configsMap.dealsConfig[currentConfigKey];
    delete configsMap.dealsConfig['newDealsConfig'];

    this.setState({ configsMap });

    this.props.onChange('dealsConfig', configsMap);
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
  renderCollapse() {
    const { configsMap } = this.state;
    const mapping = configsMap.dealsConfig || {};
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
    return (
      <FlexRow>
        <LeftItem>
          {actionButtons}
          <br />
          <br />
          {this.renderContent(mapping)}
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
export default DealsConfig;
