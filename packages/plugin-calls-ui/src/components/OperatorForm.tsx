import React from 'react';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ControlLabel, FormControl } from '@erxes/ui/src/components/form';
import { __ } from '@erxes/ui/src/utils/core';
import { Operator } from '../types';

type Props = {
  operator?: Operator;
  index: number;
  formProps: any;
  onChange: (index: number, value: any) => void;
};

const OperatorForm = (props: Props) => {
  const { formProps, operator, onChange, index } = props;

  const onSelectUser = value => {
    onChange(index, { ...operator, userId: value });
  };

  return (
    <FormGroup>
      <FormGroup>
        <SelectTeamMembers
          label={`Choose operator ${index + 1}`}
          name="selectedMembers"
          multi={false}
          initialValue={(operator && operator.userId) || ''}
          onSelect={onSelectUser}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel required={true}>
          {__('GrandStream username')}
        </ControlLabel>
        <FormControl {...formProps} name={`username${index}`} required={true} />
      </FormGroup>
      <FormGroup>
        <ControlLabel required={true}>
          {__('GrandStream password')}
        </ControlLabel>
        <FormControl {...formProps} name={`password${index}`} required={true} />
      </FormGroup>
    </FormGroup>
  );
};

export default OperatorForm;
