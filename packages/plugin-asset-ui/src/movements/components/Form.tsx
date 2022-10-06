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
import { IAsset, IMovementType, SelectedVariables } from '../../common/types';
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
  detail: IMovementType;
  refetch: (variables: any) => void;
  closeModal: () => void;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  variables: SelectedVariables;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.state = {
      variables: props.detail || {}
    };
  }

  generateDoc(values) {
    const { variables } = this.state;
    return { ...variables };
  }

  assetChooser(props) {
    const handleSelect = datas => {
      const data = datas[0];
      this.setState({
        variables: { assetId: data._id, assetName: data.name, userType: '' }
      });
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

  renderRow(p, selection?: any) {
    let { variables } = this.state;

    let Selection;
    let name = `selected${p}Ids`;
    let label = p;
    let field;

    if (p === 'Branches') {
      Selection = SelectBranches;
      field = 'branchId';
    }
    if (p === 'Departments') {
      Selection = SelectDepartments;
      field = 'departmentId';
    }
    if (p === 'TeamMember') {
      Selection = SelectTeamMembers;
      label = `${label.substring(0, 4)} ${label.substring(4, label.length)}`;
      field = 'teamMemberId';
    }
    if (p === 'Company') {
      Selection = SelectCompanies;
      field = 'companyId';
    }
    if (p === 'Customer') {
      Selection = SelectCustomers;
      field = 'customerId';
    }

    const handleChange = selected => {
      this.setState(prev => ({ variables: { ...prev.variables, [field]: selected } }));
    };

    return (
      <BarItems key={p}>
        <div>{__(`Current ${label}:`)}</div>
        <Icon icon="arrow-down" />
        {selection}
        {p !== 'User Type' && (
          <Selection
            label={`Choose ${label}`}
            name={name}
            onSelect={handleChange}
            multi={false}
            initialValue={variables[field]}
          />
        )}
      </BarItems>
    );
  }

  renderBox(formProps: IFormProps) {
    const { variables } = this.state;
    const selectionUserType = () => {
      const handleSelect = e => {
        const { value } = e.currentTarget as HTMLInputElement;

        this.setState(prev => ({ variables: { ...prev.variables, userType: value } }));
      };

      return (
        <div style={{ width: '200px' }}>
          <FormControl
            componentClass="select"
            defaultValue={variables?.assetId}
            onChange={handleSelect}
            required
            {...formProps}
          >
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
        {this.renderRow('Branches')}
        {this.renderRow('Departments')}
        {this.renderRow('User Type', selectionUserType())}
        {variables?.userType &&
          variables?.userType.length > 0 &&
          this.renderRow(variables.userType)}
        <BarItems></BarItems>
      </>
    );
  }

  renderSelectedAssetsContent(formProps: IFormProps) {
    const { variables } = this.state;
    return (
      <CollapseContent
        key={variables.assetId}
        title={variables.assetName ? variables.assetName : ''}
      >
        {this.renderBox(formProps)}
      </CollapseContent>
    );
  }

  renderContent(formProps: IFormProps) {
    const { variables } = this.state;
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <ContainerBox column gap={40}>
        <ContainerBox row spaceBetween>
          <Title>Movements</Title>
          {this.renderChooser()}
        </ContainerBox>
        {!_loadash.isEmpty(variables) ? (
          this.renderSelectedAssetsContent(formProps)
        ) : (
          <EmptyState text="No Selected Asset" image="/images/actions/5.svg" />
        )}

        <ModalFooter>
          <Button btnStyle="simple" onClick={() => closeModal()}>
            Cancel
          </Button>
          {renderButton &&
            renderButton({
              name: 'asset and movements',
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal
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
