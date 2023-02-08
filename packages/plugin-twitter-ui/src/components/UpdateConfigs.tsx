import React from 'react';

import CollapseContent from '@erxes/ui/src/components/CollapseContent';
import Info from '@erxes/ui/src/components/Info';
import { __ } from 'coreui/utils';
import { IConfigsMap } from '@erxes/ui-settings/src/general/types';
import Button from '@erxes/ui/src/components/Button';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { FormControl } from '@erxes/ui/src/components/form';

const KEY_LABELS = {
  TWITTER_CONSUMER_KEY: 'Twitter Consumer Key',
  TWITTER_CONSUMER_SECRET: 'Twitter Consumer Secret',
  TWITTER_ACCESS_TOKEN: 'Twitter Access Token',
  TWITTER_ACCESS_TOKEN_SECRET: 'Twitter Access Token Secret',
  TWITTER_WEBHOOK_ENV: 'Twitter Webhook Env',
  TWITTER_BEARER_TOKEN: 'Twitter Bearer Token'
};

type Props = {
  loading: boolean;
  updateConfigs: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

type State = {
  configsMap: IConfigsMap;
};

class UpdateConfigs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { configsMap: props.configsMap };
  }

  onChangeConfig = (code: string, value) => {
    const { configsMap } = this.state;

    configsMap[code] = value;

    this.setState({ configsMap });
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  renderItem = (
    key: string,
    type?: string,
    description?: string,
    defaultValue?: string,
    label?: string
  ) => {
    const { configsMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{label || KEY_LABELS[key]}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          type={type || 'text'}
          defaultValue={configsMap[key] || defaultValue}
          onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  };
  render() {
    const onClick = () => {
      this.props.updateConfigs(this.state.configsMap);
    };
    return (
      <>
        <CollapseContent title="Twitter">
          <Info>
            <a
              target="_blank"
              href="https://erxes.org/administrator/system-config#twitter"
              rel="noopener noreferrer"
            >
              {__('Learn how to set Twitter Integration Variables')}
            </a>
          </Info>

          {this.renderItem('TWITTER_CONSUMER_KEY')}
          {this.renderItem('TWITTER_CONSUMER_SECRET')}
          {this.renderItem('TWITTER_ACCESS_TOKEN')}
          {this.renderItem('TWITTER_ACCESS_TOKEN_SECRET')}
          {this.renderItem('TWITTER_WEBHOOK_ENV')}
          {this.renderItem('TWITTER_BEARER_TOKEN')}
          <Button onClick={onClick}>{__('Save')}</Button>
        </CollapseContent>
      </>
    );
  }
}

export default UpdateConfigs;
