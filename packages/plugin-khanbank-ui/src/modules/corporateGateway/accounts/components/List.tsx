import { Description } from '@erxes/ui-settings/src/styles';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IRouterProps } from '@erxes/ui/src/types';
import * as routerUtils from '@erxes/ui/src/utils/router';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { IKhanbankAccount } from '../types';

type Props = {
  queryParams: any;
  configId: string;
  accounts: IKhanbankAccount[];
} & IRouterProps;

const AccountList = (props: any) => {
  const { queryParams, accounts, history } = props;

  const onClickRow = e => {
    routerUtils.setParams(history, {
      _id: props.configId,
      account: e.currentTarget.id
    });
  };

  return (accounts || []).map(account => (
    <div
      id={account.number}
      key={account.number}
      style={{ display: 'block' }}
      onClick={onClickRow}
    >
      <ControlLabel>{account.number}</ControlLabel>

      <Description>{account.name}</Description>
    </div>

    //  <ActionButtons>
    // {this.renderCategoryEditAction(category)}
    // {this.renderCategoryRemoveAction(category._id)}
    // </ActionButtons>
    // </SidebarListItem>
  ));
};

export default withRouter<Props>(AccountList);
