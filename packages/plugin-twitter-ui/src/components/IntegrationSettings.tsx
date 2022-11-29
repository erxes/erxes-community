import CollapseContent from '@erxes/ui/src/components/CollapseContent';
import React from 'react';
import Info from '@erxes/ui/src/components/Info';
import { __ } from 'coreui/utils';
import { IFormProps } from '@erxes/ui/src/types';
import Form from '@erxes/ui/src/components/form/Form';
import { IConfigsMap } from '@erxes/ui-settings/src/general/types';

type Props = {
  renderItem: (
    key: string,
    type?: string,
    description?: string,
    defaultValue?: string,
    label?: string
  ) => void;

  configsMap: IConfigsMap;
};

class TwitterSettings extends React.Component<Props> {
  renderContent = (formProps: IFormProps) => {
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

          {this.props.renderItem(
            'TWITTER_CONSUMER_KEY',
            'text',
            '',
            '',
            'Twitter Consumer Key'
          )}
          {this.props.renderItem(
            'TWITTER_CONSUMER_SECRET',
            'text',
            '',
            '',
            'Twitter Consumer Secret'
          )}
          {this.props.renderItem(
            'TWITTER_ACCESS_TOKEN',
            'text',
            '',
            '',
            'Twitter Access Token'
          )}
          {this.props.renderItem(
            'TWITTER_ACCESS_TOKEN_SECRET',
            'text',
            '',
            '',
            'Twitter Access Token Secret'
          )}
          {this.props.renderItem(
            'TWITTER_WEBHOOK_ENV',
            'text',
            '',
            '',
            'Twitter Webhook Env'
          )}
          {this.props.renderItem(
            'TWITTER_BEARER_TOKEN',
            'text',
            '',
            '',
            'Twitter Bearer Token'
          )}
        </CollapseContent>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default TwitterSettings;
