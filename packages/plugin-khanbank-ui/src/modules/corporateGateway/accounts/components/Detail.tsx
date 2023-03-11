import { Description } from '@erxes/ui-settings/src/styles';
import Button from '@erxes/ui/src/components/Button';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Toggle from '@erxes/ui/src/components/Toggle';
import { IRouterProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { Block, BlockRow } from '../../../../styles';
import { getCurrencySymbol } from '../../../../utils';
import Transactions from '../../transactions/containers/List';
import { IKhanbankAccount } from '../types';
import TransactionForm from '../../transactions/containers/Form';

type Props = {
  queryParams: any;
  account: IKhanbankAccount;
} & IRouterProps;

const Detail = (props: Props) => {
  const { account, queryParams } = props;
  const accountNumber = queryParams.account;

  const transactionTrigger = (
    <Button btnStyle="simple" size="small" icon="money-insert">
      {__('Transfer')}
    </Button>
  );

  const transactionFormContent = modalProps => (
    <TransactionForm
      {...modalProps}
      configId={queryParams._id}
      accountNumber={queryParams.account}
    />
  );

  const renderAccount = () => {
    const holderInfo = `${account.holderInfo.custFirstName || ''} ${account
      .holderInfo.custLastName || ''}`;

    return (
      <Block>
        <h4>{__('Account detail')}</h4>
        <BlockRow>
          <FormGroup>
            <p>{__('Account')}</p>
            <strong>{accountNumber}</strong>
          </FormGroup>

          <FormGroup>
            <p>{__('Account holder')} </p>
            <strong>{holderInfo}</strong>
          </FormGroup>

          <FormGroup>
            <p>{__('Balance')} </p>
            <strong>
              {account.balance.toLocaleString()}{' '}
              {getCurrencySymbol(account.currency || 'MNT')}
            </strong>
          </FormGroup>
        </BlockRow>

        <BlockRow>
          <FormGroup>
            <p>{__('Default account')}</p>
            <Toggle
              checked={false}
              onChange={() => {
                console.log('toggle');
              }}
              icons={{
                checked: <span>Yes</span>,
                unchecked: <span>No</span>
              }}
            />
          </FormGroup>

          <FormGroup>
            <ModalTrigger
              size="lg"
              title="Transfer"
              autoOpenKey="showAppAddModal"
              trigger={transactionTrigger}
              content={transactionFormContent}
            />
          </FormGroup>
        </BlockRow>
      </Block>
    );
  };

  const renderStatements = () => {
    return (
      <Block>
        <h4>{__('Latest transactions')}</h4>
        {/* <Description>{__('transactions made today')}</Description> */}
        <Transactions {...props} showLatest={true} />
      </Block>
    );
  };

  return (
    <>
      {renderAccount()}
      {renderStatements()}
    </>
  );
};

export default Detail;
