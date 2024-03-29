import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';

import React from 'react';

interface IProps {
  integrationKind: string;
  details: any;
  onChange: (key: string, value: any) => void;
}

const IntegrationEditForm = (props: IProps) => {
  if (props.integrationKind !== 'imap') {
    return null;
  }

  const onChange = (e: any) => {
    props.onChange(e.target.name, e.target.value);
  };

  const renderInput = (
    name: string,
    label: string,
    defaultValue: string,
    type?: string
  ) => {
    return (
      <FormGroup>
        <ControlLabel required={false}>{label}</ControlLabel>
        <FormControl
          name={name}
          required={false}
          autoFocus={false}
          defaultValue={defaultValue}
          onChange={onChange}
          type={type}
        />
      </FormGroup>
    );
  };

  const keys = ['host', 'smtpHost', 'smtpPort', 'mainUser', 'user'];

  return (
    <>
      {keys.map(key => {
        return renderInput(key, key, props.details[key] || '');
      })}
      {renderInput(
        'password',
        'Password',
        props.details.password || '',
        'password'
      )}
    </>
  );
};

export default IntegrationEditForm;
