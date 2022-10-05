import {
  Button,
  Chooser,
  ModalTrigger,
  EmptyState,
  CollapseContent,
  __,
  Icon,
  BarItems,
  FormControl,
  SelectTeamMembers,
  Form as CommonForm
} from '@erxes/ui/src';

import React from 'react';
import { IAsset, SelectedVariables } from '../../common/types';
import AssetForm from '../../asset/containers/Form';
import { Title } from '@erxes/ui-settings/src/styles';
import { ContainerBox } from '../../style';
import AssetChooser from './Chooser';
import { USER_TYPES } from '../../common/constant';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import _loadash from 'lodash';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
type Props = {
  assets: IAsset[];
  refetch: (variables: any) => void;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  movements?: any[];
};

type State = {
  selectedAssets: IAsset[];
  variables: SelectedVariables[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.state = {
      selectedAssets: [],
      variables: []
    };
  }

  generateDoc(values) {}

  assetChooser(props) {
    const handleSelect = datas => {
      this.setState({ selectedAssets: datas });

      const variables = datas.map(d => ({
        id: d._id,
        userType: ''
      }));

      this.setState({ variables });
    };

    const updatedProps = {
      ...props,
      handleSelect,
      datas: this.props.assets
    };

    return <AssetChooser {...updatedProps} />;
  }

  assetChooserTrigger = (<Button>Select Assets</Button>);

  assetChooserContent() {
    return (
      <ModalTrigger
        title="Select Assets"
        content={this.assetChooser}
        trigger={this.assetChooserTrigger}
        size="lg"
      />
    );
  }

  renderChooser() {
    return <>{this.assetChooserContent()}</>;
  }

  renderRow(p, asset: IAsset, selection?: any) {
    let Selection;
    let name = `selected${p}Ids`;
    let label = p;

    if (p === 'Branches') {
      Selection = SelectBranches;
    }
    if (p === 'Departments') {
      Selection = SelectDepartments;
    }
    if (p === 'TeamMember') {
      Selection = SelectTeamMembers;
      label = `${label.substring(0, 4)} ${label.substring(4, label.length)}`;
    }
    if (p === 'Company') {
      Selection = SelectCompanies;
    }
    if (p === 'Customer') {
      Selection = SelectCustomers;
    }

    const handleChange = selected => {
      let { variables } = this.state;
      const field = p.charAt(0).toLowerCase() + p.slice(1);

      if (variables.some(selectedAsset => selectedAsset?.id === asset._id)) {
        variables = variables.map(selectedAsset =>
          selectedAsset.id === asset._id ? { ...selectedAsset, [field]: selected } : selectedAsset
        );
      }

      this.setState({ variables });
    };

    return (
      <BarItems key={p}>
        <div>{__(`Current ${label}:`)}</div>
        <Icon icon="arrow-down" />
        {selection}
        {p !== 'User Type' && (
          <Selection label={`Choose ${label}`} name={name} onSelect={handleChange} />
        )}
      </BarItems>
    );
  }

  renderBox(formProps: IFormProps, asset: IAsset) {
    const { variables } = this.state;

    const current = variables.find(variable => variable.id === asset._id);

    const selectionUserType = () => {
      const handleSelect = e => {
        let { variables } = this.state;
        const { value } = e.currentTarget as HTMLInputElement;

        variables = variables.map(selectedAsset =>
          selectedAsset.id === asset._id ? { ...selectedAsset, userType: value } : selectedAsset
        );

        this.setState({ variables });
      };

      return (
        <div style={{ width: '200px' }}>
          <FormControl componentClass="select" onChange={handleSelect} required {...formProps}>
            {USER_TYPES.map(type => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </FormControl>
        </div>
      );
    };

    return (
      <>
        {this.renderRow('Branches', asset)}
        {this.renderRow('Departments', asset)}
        {this.renderRow('User Type', asset, selectionUserType())}
        {current?.userType &&
          current?.userType.length > 0 &&
          this.renderRow(current.userType, asset)}
        <BarItems></BarItems>
      </>
    );
  }

  renderSelectedAssetsContent(formProps: IFormProps) {
    const { selectedAssets } = this.state;
    return (
      <div>
        {selectedAssets.map(asset => {
          return (
            <CollapseContent key={asset._id} title={asset.name}>
              {this.renderBox(formProps, asset)}
            </CollapseContent>
          );
        })}
      </div>
    );
  }

  renderContent(formProps: IFormProps) {
    const { selectedAssets } = this.state;
    const { closeModal, renderButton, movements } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <ContainerBox column gap={40}>
        <ContainerBox row spaceBetween>
          <Title>Movements</Title>
          {this.renderChooser()}
        </ContainerBox>
        {selectedAssets.length > 0 ? (
          this.renderSelectedAssetsContent(formProps)
        ) : (
          <EmptyState text="No Selected Assets" image="/images/actions/5.svg" />
        )}

        <ModalFooter>
          <Button btnStyle="simple" onClick={() => closeModal()}>
            Cancel
          </Button>
          {renderButton({
            name: 'asset and movements',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: movements
          })}
        </ModalFooter>
      </ContainerBox>
    );
  }

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
