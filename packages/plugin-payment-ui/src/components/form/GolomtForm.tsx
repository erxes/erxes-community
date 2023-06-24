import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __, getEnv } from '@erxes/ui/src/utils';
import React from 'react';
import { IPaymentDocument, ISocialPayConfig } from '../../types';

import { PAYMENTCONFIGS, PAYMENT_KINDS } from '../constants';
import { SettingsContent } from './styles';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  payment?: IPaymentDocument;
  metaData?: any;
};

type State = {
  paymentName: string;
  golomtTerminal: string;
  golomtKey: string;
};

class SocialPayConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { payment } = this.props;
    const { name, config } = payment || ({} as IPaymentDocument);
    const { golomtTerminal, golomtKey } = config || ({} as ISocialPayConfig);

    this.state = {
      paymentName: name || '',
      golomtTerminal: golomtTerminal || '',
      golomtKey: golomtKey || ''
    };
  }

  generateDoc = (values: {
    paymentName: string;
    golomtTerminal: string;
    golomtKey: string;
  }) => {
    const { payment } = this.props;
    const generatedValues = {
      name: values.paymentName,
      kind: PAYMENT_KINDS.GOLOMT,
      status: 'active',
      config: {
        golomtTerminal: values.golomtTerminal,
        golomtKey: values.golomtKey
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
    const value =
      key === 'pushNotification'
        ? `${getEnv().REACT_APP_API_URL}/pl:payment/callback/golomt`
        : this.state[key];

    return (
      <FormGroup>
        <ControlLabel>{title}</ControlLabel>
        {description && <p>{description}</p>}
        <FormControl
          defaultValue={value}
          onChange={this.onChangeConfig.bind(this, key)}
          value={value}
          disabled={key === 'pushNotification'}
          type={isPassword ? 'password' : ''}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal } = this.props;
    const { isSubmitted } = formProps;
    const { paymentName, golomtTerminal, golomtKey } = this.state;

    const values = {
      paymentName,
      golomtTerminal,
      golomtKey
    };

    return (
      <>
        <SettingsContent title={__('General settings')}>
          {this.renderItem('paymentName', 'Name')}
          {this.renderItem('golomtTerminal', 'Terminal')}
          {this.renderItem('golomtKey', 'Key', '', true)}
          {this.renderItem(
            'pushNotification',
            'Notification URL',
            'Register following URL in Golomt Bank'
          )}

          <a href={this.props.metaData.link} target="_blank" rel="noreferrer">
            {__('more about Golomt E-Commerce')}
          </a>
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
            name: 'socialpay',
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

export default SocialPayConfigForm;
