import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';

import { IPaymentDocument, IPocketConfig } from '../../types';
import { PAYMENT_KINDS } from '../constants';
import { SettingsContent } from './styles';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  payment?: IPaymentDocument;
  metaData?: any;
};

type State = {
  paymentName: string;
  merchant: string;

  clientId: string;
  clientSecret: string;
};

class PocketConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { payment } = this.props;
    const { name = '', config } = payment || ({} as IPaymentDocument);
    const { merchant = '', clientId = '', clientSecret = '' } =
      config || ({} as IPocketConfig);

    this.state = {
      paymentName: name,
      merchant,
      clientId,
      clientSecret
    };
  }

  generateDoc = (values: {
    paymentName: string;
    merchant: string;
    clientId: string;
    clientSecret: string;
  }) => {
    const { payment } = this.props;
    const generatedValues = {
      name: values.paymentName,
      kind: PAYMENT_KINDS.POCKET,
      status: 'active',
      config: {
        merchant: values.merchant,
        clientId: values.clientId,
        clientSecret: values.clientSecret
      }
    };

    return payment ? { ...generatedValues, id: payment._id } : generatedValues;
  };

  onChangeConfig = (code: string, e) => {
    this.setState({ [code]: e.target.value } as any);
  };

  renderItem = (
    key: string,
    title: string,
    description?: string,
    isPassword?: boolean
  ) => {
    const value = this.state[key];

    return (
      <FormGroup>
        <ControlLabel>{title}</ControlLabel>
        {description && <p>{description}</p>}
        <FormControl
          defaultValue={value}
          onChange={this.onChangeConfig.bind(this, key)}
          value={value}
          type={isPassword ? 'password' : ''}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal } = this.props;
    const { isSubmitted } = formProps;
    const { paymentName, merchant, clientId, clientSecret } = this.state;

    const values = {
      paymentName,
      merchant,
      clientId,
      clientSecret
    };

    return (
      <>
        <SettingsContent title={__('General settings')}>
          {this.renderItem('paymentName', 'Name')}
          {this.renderItem('merchant', 'Merchant')}
          {this.renderItem('clientId', 'Client ID')}
          {this.renderItem('clientSecret', 'Client secret', '', true)}

          {/* <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScxZItJ5egDhNqSOMTj6np6d9yrb5zW9micqvqxHFcyhsRszg/viewform"
            target="_blank"
            rel="noreferrer"
          >
            {__('Apply for storepay')}
          </a> */}
        </SettingsContent>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Cancel
          </Button>
          {renderButton({
            name: 'pocket',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default PocketConfigForm;
