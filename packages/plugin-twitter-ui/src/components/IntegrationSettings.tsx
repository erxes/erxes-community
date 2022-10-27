import CollapseContent from '@erxes/ui/src/components/CollapseContent';
import React from 'react';
import Info from '@erxes/ui/src/components/Info';
import { __ } from 'coreui/utils';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components/form';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import Form from '@erxes/ui/src/components/form/Form';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';

class TwitterSettings extends React.Component<any> {
  generateDoc = (values: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    webhookEnv: string;
  }) => {
    return {
      consumerKey: values.consumerKey,
      consumerSecret: values.consumerSecret,
      kind: 'twitter',
      accessToken: values.accessToken,
      accessTokenSecret: values.accessTokenSecret,
      webhookEnv: values.webhookEnv
    };
  };
  renderField = ({ label, name }: { label: string; name: string }) => {
    return (
      <FormGroup>
        <ControlLabel required={true}>{label}</ControlLabel>
        <FormControl name={name} required={true} autoFocus={name === 'name'} />
      </FormGroup>
    );
  };

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

          {this.renderField({
            label: 'Twitter Consumer Key',
            name: 'TWITTER_CONSUMER_KEY'
          })}
          {this.renderField({
            label: 'Twitter Consumer Secret',
            name: 'TWITTER_CONSUMER_SECRET'
          })}
          {this.renderField({
            label: 'Twitter Access Token',
            name: 'TWITTER_ACCESS_TOKEN'
          })}
          {this.renderField({
            label: 'Twitter Access Token Secret',
            name: 'TWITTER_ACCESS_TOKEN_SECRET'
          })}
          {this.renderField({
            label: 'Twitter Webhook Env',
            name: 'TWITTER_WEBHOOK_ENV'
          })}
        </CollapseContent>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default TwitterSettings;
