import React, { useState } from 'react';
import IncomingCall from '../components/IncomingCall';
import { queries } from '../graphql';
import { useQuery, gql } from '@apollo/client';

import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  ModalTrigger,
  Spinner
} from '@erxes/ui/src/components';
import { Alert } from '@erxes/ui/src/utils';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { __ } from '@erxes/ui/src/utils/core';
import { IFormProps } from '@erxes/ui/src/types';

interface Props {
  closeModal: () => void;
  data: any;
}

const renderInput = (
  name: string,
  label: string,
  defaultValue: string,
  formProps: any
) => {
  return (
    <FormGroup>
      <ControlLabel required={false}>{label}</ControlLabel>
      <FormControl
        name={name}
        required={false}
        autoFocus={false}
        defaultValue={defaultValue}
        disabled
        {...formProps}
      />
    </FormGroup>
  );
};

const CallIntegrationModal = (props: Props) => {
  const { closeModal, data } = props;
  const [indexSaver, setIndexSaver] = useState<any>(0);

  const saveCallConfig = () => {
    localStorage.setItem(
      'config:call_integrations',
      JSON.stringify({
        inboxId: data[indexSaver].inboxId,
        phone: data[indexSaver].phone,
        wsServer: data[indexSaver].wsServer,
        token: data[indexSaver].token,
        operators: data[indexSaver].operators,
        isAvailable: true
      })
    );
    closeModal();
  };

  const onChange = e => {
    setIndexSaver(e.target.value);
  };

  const renderContent = (formProps: IFormProps) => {
    return (
      <>
        <FormGroup>
          <FormControl
            {...formProps}
            name="phone"
            componentClass="select"
            placeholder={__('Select Brand')}
            defaultValue={data[indexSaver].phone}
            onChange={onChange}
            required={true}
          >
            {data.map((int, index: number) => (
              <option key={int._id} value={index}>
                {int.phone}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        {renderInput(
          'wsServer',
          'Web socket server',
          data[indexSaver].wsServer,
          formProps
        )}

        {data[indexSaver].operators.map((operator: any, index: number) => {
          return (
            <>
              <ControlLabel>Operator {index + 1}</ControlLabel>
              {renderInput('userId', 'user id', operator.userId, formProps)}
              {renderInput(
                'gsUsername',
                'grandstream username',
                operator.gsUsername,
                formProps
              )}
              {renderInput(
                'gsPassword',
                'grandstream password',
                operator.gsPassword,
                formProps
              )}
            </>
          );
        })}

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            btnStyle="success"
            icon="check-circle"
            onClick={saveCallConfig}
          >
            {__('Save')}
          </Button>
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

const IncomingCallContainer = () => {
  const { data, loading, error } = useQuery(
    gql(queries.callsIntegrationOperator),
    {
      fetchPolicy: 'network-only'
    }
  );

  if (loading && !data) return null;

  if (error) return Alert.error(error.message);

  const { callsIntegrationOperator } = data;

  const callConfig = localStorage.getItem('config:call_integrations');

  const content = props => (
    <CallIntegrationModal {...props} data={callsIntegrationOperator} />
  );

  if (!callConfig) {
    return (
      <ModalTrigger title="Call Config Modal" content={content} isOpen={true} />
    );
  }

  return <IncomingCall />;
};

export default IncomingCallContainer;
