import React from 'react';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Info from '@erxes/ui/src/components/Info';

type Props = {};

class IntegrationForm extends React.Component<Props> {
  generateDoc = (values: {
    name: string;
    host: string;
    smtpHost: string;
    smtpPort: string;
    user: string;
    password: string;
    brandId: string;
  }) => {
    return {
      name: values.name,
      brandId: values.brandId,
      kind: 'imap',
      data: {
        host: values.host,
        smtpHost: values.smtpHost,
        smtpPort: values.smtpPort,
        user: values.user,
        password: values.password
      }
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

  renderContent = () => {
    return (
      <>
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
          label: 'Host',
          name: 'TWITTER_CONSUMER_SECRET',
          formProps
        })}
        {this.renderField({
          label: 'Smpt host',
          name: 'TWITTER_ACCESS_TOKEN',
          formProps
        })}
        {this.renderField({
          label: 'Smpt port',
          name: 'TWITTER_ACCESS_TOKEN_SECRET',
          formProps
        })}
        {this.renderField({
          label: 'Smpt port',
          name: 'TWITTER_WEBHOOK_ENV',
          formProps
        })}
      </>
    );
  };
}
