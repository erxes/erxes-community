import * as React from 'react';

import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';

import Accounts from '../containers/Accounts';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import SelectBrand from '../containers/SelectBrand';
import Spinner from '@erxes/ui/src/components/Spinner';
import SelectChannels from '@erxes/ui-inbox/src/settings/integrations/containers/SelectChannels';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onAccountSelect: (accountId?: string) => void;
  onRemoveAccount: (accountId: string) => void;
  closeModal: () => void;
  callback: () => void;
  accountId: string;
  twitterAccountId: string;
  channelIds: string[];
  onChannelChange: () => void;
};

class Twitter extends React.Component<Props, { loading: boolean }> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  generateDoc = (values: {
    name: string;
    brandId: string;
    channelIds: string;
  }) => {
    const { accountId, twitterAccountId } = this.props;

    return {
      name: values.name,
      brandId: values.brandId,
      channelIds: values.channelIds,
      kind: 'twitter',
      accountId,
      data: { twitterAccountId }
    };
  };

  renderContent = (formProps: IFormProps) => {
    const {
      onRemoveAccount,
      onAccountSelect,
      renderButton,
      callback,
      channelIds,
      onChannelChange
    } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        {this.state.loading && <Spinner />}
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl {...formProps} name="name" required={true} />
        </FormGroup>

        <SelectBrand isRequired={true} formProps={formProps} />
        <SelectChannels
          defaultValue={channelIds}
          isRequired={true}
          onChange={onChannelChange}
        />

        <Accounts
          kind="twitter"
          addLink="login"
          onSelect={onAccountSelect}
          onRemove={onRemoveAccount}
          formProps={formProps}
        />

        <ModalFooter>
          {renderButton({
            name: 'integration',
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

export default Twitter;
