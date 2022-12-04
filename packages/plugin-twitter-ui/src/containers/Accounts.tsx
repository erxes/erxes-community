import * as compose from 'lodash.flowright';
import { Alert, getEnv, withProps } from '@erxes/ui/src/utils';
import { IntegrationTypes } from '../types';
import Accounts from '../components/Accounts';
import Info from '@erxes/ui/src/components/Info';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { queries, mutations } from '../graphql';

type Props = {
  kind: IntegrationTypes;
  onSelectAccount: (accountId: string) => void;
  accountId: string;
};

type FinalProps = {
  twitterAccounts: any;
  removeAccount: any;
} & Props;
class AccountContainer extends React.Component<FinalProps, {}> {
  popupWindow(url, title, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
    const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;

    return win.open(
      url,
      title,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
    );
  }

  onAdd = () => {
    const { REACT_APP_API_URL } = getEnv();

    this.popupWindow(
      `${REACT_APP_API_URL}/pl:twitter/login`,
      'Integration',
      window,
      660,
      750
    );
  };

  removeAccount = (accountId: string) => {
    const { removeAccount } = this.props;

    removeAccount({ variables: { _id: accountId } })
      .then(() => {
        Alert.success('You successfully removed an account');

        this.props.twitterAccounts.refetch();
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  render() {
    const { twitterAccounts, onSelectAccount, accountId } = this.props;

    if (twitterAccounts.loading) {
      return <Spinner objective={true} />;
    }

    if (twitterAccounts.error) {
      return <Info>{twitterAccounts.error.message}</Info>;
    }

    const accounts = twitterAccounts.twitterGetAccounts || [];

    return (
      <Accounts
        accountId={accountId}
        onSelectAccount={onSelectAccount}
        onAdd={this.onAdd}
        removeAccount={this.removeAccount}
        accounts={accounts}
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.removeAccount), {
      name: 'removeAccount',
      options: {
        refetchQueries: ['integrationsGetAccounts']
      }
    }),
    graphql<Props>(gql(queries.getAccounts), {
      name: 'twitterAccounts',
      options: ({ kind }) => ({
        variables: {
          kind
        }
      })
    })
  )(AccountContainer)
);
