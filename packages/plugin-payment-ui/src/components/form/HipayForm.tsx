import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';

import { IHipayConfig, IPaymentDocument } from '../../types';
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
  hipayEntity: string;
  hipayToken: string;
};

class HipayConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { payment } = this.props;
    const { name = '', config } = payment || ({} as IPaymentDocument);
    const { hipayEntity = '', hipayToken = '' } =
      config || ({} as IHipayConfig);

    this.state = {
      paymentName: name,
      hipayEntity,
      hipayToken
    };
  }

  generateDoc = (values: {
    paymentName: string;
    hipayEntity: string;
    hipayToken: string;
  }) => {
    const { payment } = this.props;
    const generatedValues = {
      name: values.paymentName,
      kind: PAYMENT_KINDS.HIPAY,
      status: 'active',
      config: {
        hipayEntity: values.hipayEntity,
        hipayToken: values.hipayToken
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
    const { paymentName, hipayEntity, hipayToken } = this.state;

    const values = {
      paymentName,
      hipayEntity,
      hipayToken
    };

    return (
      <>
        <SettingsContent title={__('General settings')}>
          {this.renderItem('paymentName', 'Name')}
          {this.renderItem('hipayEntity', 'Entity')}
          {this.renderItem('hipayToken', 'Token', '', true)}

          <a
            href="https://www.hipay.mn/become-merchant"
            target="_blank"
            rel="noreferrer"
          >
            {__('Go to website')}
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
            name: 'hipay',
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

export default HipayConfigForm;
