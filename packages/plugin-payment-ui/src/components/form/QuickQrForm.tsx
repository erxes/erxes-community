import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { IPaymentDocument } from '../../types';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import { SettingsContent } from './styles';
import { __ } from '@erxes/ui/src/utils';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';
import { PAYMENT_KINDS, BANK_CODES } from '../constants';
import Toggle from '@erxes/ui/src/components/Toggle';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  payment?: IPaymentDocument;
};

type State = {
  paymentName: string;
  isCompany: boolean;
  registerNumber: string;
  name: string;

  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;

  companyName: string;
  lastName: string;
  firstName: string;

  bankCode: string;
  bankAccount: string;
  bankAccountName: string;

  merchantId: string;
};

const QuickQrForm = (props: Props) => {
  const { payment, renderButton, closeModal } = props;
  const { config, name } = payment || ({} as IPaymentDocument);

  const [state, setState] = React.useState<State>({
    isCompany: config ? config.isCompany : true,
    ...config,
    name
  });

  const generateDoc = () => {
    const generatedValues = {
      name: state.name,
      kind: PAYMENT_KINDS.QPAY_QUICK_QR,
      status: 'active',
      config: {
        isCompany: state.isCompany,
        registerNumber: state.registerNumber,
        name: state.companyName,
        mccCode: state.mccCode,
        city: state.city,
        district: state.district,
        address: state.address,
        phone: state.phone,
        email: state.email,
        lastName: state.lastName,
        firstName: state.firstName,

        bankCode: state.bankCode,
        bankAccount: state.bankAccount,
        bankAccountName: state.bankAccountName,
        merchantId: state.merchantId
      }
    };

    return payment ? { id: payment._id, ...generatedValues } : generatedValues;
  };

  const onChangeConfig = (code: string, e) => {
    setState({ ...state, [code]: e.target.value });
  };

  const onChangeToggle = (value: boolean) => {
    setState({ ...state, isCompany: value });
  };

  const renderItem = (
    key: string,
    title: string,
    description?: string,
    isPassword?: boolean
  ) => {
    const value = state[key];

    return (
      <FormGroup>
        <ControlLabel>{title}</ControlLabel>
        {description && <p>{description}</p>}
        <FormControl
          defaultValue={value}
          onChange={onChangeConfig.bind(this, key)}
          value={value}
          type={isPassword ? 'password' : ''}
        />
      </FormGroup>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    const { isSubmitted } = formProps;

    return (
      <>
        <SettingsContent title={__('General settings')}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {renderItem('name', __('Name'))}

            <FormGroup>
              <ControlLabel>{__('Type')}</ControlLabel>
              <p>
                {__('If you are registering as a company, please leave it on')}
              </p>
              <Toggle
                checked={state.isCompany}
                onChange={() => onChangeToggle(!state.isCompany)}
                icons={{
                  checked: <span>Yes</span>,
                  unchecked: <span>No</span>
                }}
              />
            </FormGroup>

            {state.isCompany && renderItem('companyName', __('Company Name'))}
            {!state.isCompany && renderItem('firstName', __('First Name'))}
            {!state.isCompany && renderItem('lastName', __('Last Name'))}

            {renderItem('registerNumber', __('Register Number'))}
            {renderItem('mccCode', __('MCC Code'))}
            {renderItem('city', __('City'))}
            {renderItem('district', __('District'))}
            {renderItem('address', __('Address'))}
            {renderItem('phone', __('Phone'))}
            {renderItem('email', __('Email'))}

            <FormGroup>
              <ControlLabel required={true}>Bank</ControlLabel>
              <FormControl
                {...formProps}
                id="toBank"
                name="toBank"
                componentClass="select"
                required={true}
                defaultValue={state.bankCode}
                onChange={onChangeConfig.bind(this, 'bankCode')}
                errors={formProps.errors}
              >
                <option value="">{__('Select a bank')}</option>
                {BANK_CODES.map(bank => (
                  <option key={bank.value} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </FormControl>
            </FormGroup>

            {renderItem('bankAccount', __('Account Number'))}
            {renderItem('bankAccountName', __('Account Name'))}
          </div>
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
            passedName: 'payment',
            values: generateDoc(),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default QuickQrForm;
