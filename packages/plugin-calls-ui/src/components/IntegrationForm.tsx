import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import Button from '@erxes/ui/src/components/Button';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import React from 'react';
import SelectBrand from '@erxes/ui-inbox/src/settings/integrations/containers/SelectBrand';
import SelectChannels from '@erxes/ui-inbox/src/settings/integrations/containers/SelectChannels';
import { __ } from '@erxes/ui/src/utils/core';
import OperatorForm from './OperatorForm';
import { Operator } from '../types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  callback: () => void;
  onChannelChange: () => void;
  channelIds: string[];
};

type State = {
  operators: Operator[];
};

class IntegrationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { operators: [] };
  }

  generateDoc = (values: any) => {
    let finalOperators: any = [];
    this.state.operators.map((singleOperator: Operator, index: number) => {
      singleOperator = {
        userId: this.state.operators[index].userId,
        gsUsername: values[`username${index}`],
        gsPassword: values[`password${index}`]
      };
      finalOperators = [...finalOperators, singleOperator];
    });

    return {
      name: values.name,
      brandId: values.brandId,
      kind: 'calls',
      data: {
        wsServer: values.wsServer,
        operators: finalOperators
      }
    };
  };

  renderField = ({
    label,
    fieldName,
    formProps
  }: {
    label: string;
    fieldName: string;
    formProps: IFormProps;
  }) => {
    return (
      <FormGroup>
        <ControlLabel required={true}>{label}</ControlLabel>
        <FormControl
          {...formProps}
          name={fieldName}
          required={true}
          autoFocus={fieldName === 'name'}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, callback, onChannelChange, channelIds } = this.props;
    const { values, isSubmitted } = formProps;
    const { operators } = this.state;

    const onChangeOperators = (index: number, value: any) => {
      operators[index] = value;
      this.setState({ operators });
    };
    const handleAddOperation = () => {
      const temp = { userId: '', gsUsername: '', gsPassword: '' };
      const { operators } = this.state;

      operators.push(temp);

      this.setState({ operators });
    };

    const handleRemoveOperation = () => {
      const { operators } = this.state;

      operators.pop();

      this.setState({ operators });
    };
    return (
      <>
        {this.renderField({ label: 'Name', fieldName: 'name', formProps })}

        {this.renderField({
          label: 'Phone number',
          fieldName: 'phone',
          formProps
        })}

        {this.renderField({
          label: 'Web socket server',
          fieldName: 'wsServer',
          formProps
        })}

        <>
          {operators.map((operator, index) => (
            <OperatorForm
              operator={operator}
              index={index}
              formProps={formProps}
              onChange={onChangeOperators}
              key={index}
            />
          ))}
          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                btnStyle="primary"
                icon="plus"
                size="medium"
                onClick={handleAddOperation}
              >
                {__('Add Operator')}
              </Button>

              <Button
                btnStyle="danger"
                icon="times"
                size="medium"
                onClick={handleRemoveOperation}
              >
                {__('Remove Operator')}
              </Button>
            </div>
          </FormGroup>
        </>

        <SelectBrand
          isRequired={true}
          formProps={formProps}
          description={'Which specific Brand does this integration belong to?'}
        />

        <SelectChannels
          defaultValue={channelIds}
          isRequired={true}
          onChange={onChannelChange}
        />

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
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default IntegrationForm;
