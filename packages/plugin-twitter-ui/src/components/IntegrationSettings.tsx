import React from 'react';
import Info from '@erxes/ui/src/components/Info';
import { __ } from 'coreui/utils';
import Form from '@erxes/ui/src/components/form/Form';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components/form';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';
import CollapseContent from '@erxes/ui/src/components/CollapseContent';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  callback: () => void;
};

class IntegrationForm extends React.Component<Props> {
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

  renderField = ({
    label,
    name,
    formProps
  }: {
    label: string;
    name: string;
    formProps: IFormProps;
  }) => {
    return (
      <FormGroup>
        <ControlLabel required={true}>{label}</ControlLabel>
        <FormControl
          {...formProps}
          name={name}
          required={true}
          autoFocus={name === 'name'}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, callback } = this.props;
    const { values, isSubmitted } = formProps;

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaa');

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
            name: 'TWITTER_CONSUMER_KEY',
            formProps
          })}
          {this.renderField({
            label: 'Twitter Consumer Secret',
            name: 'TWITTER_CONSUMER_SECRET',
            formProps
          })}
          {this.renderField({
            label: 'Twitter Access Token',
            name: 'TWITTER_ACCESS_TOKEN',
            formProps
          })}
          {this.renderField({
            label: 'Twitter Access Token Secret',
            name: 'TWITTER_ACCESS_TOKEN_SECRET',
            formProps
          })}
          {this.renderField({
            label: 'Twitter Webhook Env',
            name: 'TWITTER_WEBHOOK_ENV',
            formProps
          })}

          <ModalFooter>
            <Button
              btnStyle="simple"
              type="button"
              onClick={callback}
              icon="times-circle"
            >
              Cancel
            </Button>
            {renderButton({
              values: this.generateDoc(values),
              isSubmitted,
              callback
            })}
          </ModalFooter>
        </CollapseContent>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default IntegrationForm;
