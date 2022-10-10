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
import AssetChooser from '../containers/Chooser';
import { USER_TYPES } from '../../common/constant';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import _loadash from 'lodash';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
type Props = {
  detail: IMovementType;
  closeModal: () => void;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  variables: SelectedVariables[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.state = {
      variables: props.detail || []
    };
  }

  generateDoc(values) {
    const { variables } = this.state;
    return { movements: variables };
  }

  assetChooser(props) {
    const handleSelect = datas => {
      const newVariables = datas.map(data => ({ ...data?.currentMovement, assetId: data._id, assetName: data.name }));
      this.setState({ variables: newVariables });
    };

    const updatedProps = {
      ...props,
      handleSelect
    };

    return <AssetChooser {...updatedProps} />;
  }

  assetChooserTrigger = (<Button>Select Assets</Button>);

  assetChooserContent() {
    return <ModalTrigger title="Select Assets" content={this.assetChooser} trigger={this.assetChooserTrigger} size="lg" />;
  }

  renderChooser() {
    return <>{this.assetChooserContent()}</>;
  }

  renderRow(label, asset) {
    let { variables } = this.state;

    let Selection;
    let field;
    let text = '';

    if (label === 'Branches') {
      Selection = SelectBranches;
      field = 'branchId';
      text = asset?.branch?.title;
    }
    if (label === 'Departments') {
      Selection = SelectDepartments;
      field = 'departmentId';
      text = asset?.department?.title;
    }
    if (label === 'Team Member') {
      Selection = SelectTeamMembers;
      field = 'teamMemberId';
      text = asset?.teamMember?.email;
    }
    if (label === 'Company') {
      Selection = SelectCompanies;
      field = 'companyId';
    }
    if (label === 'Customer') {
      Selection = SelectCustomers;
      field = 'customerId';
      text = asset?.customer?.primaryEmail;
    }

    const handleChange = selected => {
      variables = variables.map(item => (item.assetId === asset.assetId ? { ...item, [field]: selected } : item));
      this.setState({ variables });
    };

    return (
      <BarItems key={label}>
        <div>{__(`Current ${label}: ${__(text)}`)}</div>
        <Icon icon="rightarrow" />
        <Selection label={`Choose ${label}`} onSelect={handleChange} multi={false} />
      </BarItems>
    );
  }

  renderList(formProps: IFormProps) {
    const { variables } = this.state;

    if (variables.length === 0) {
      return <EmptyState text="No Selected Asset" image="/images/actions/5.svg" />;
    }

    return variables.map(item => (
      <CollapseContent key={item.assetId} title={item.assetName || ''}>
        {this.renderRow('Branches', item)}
        {this.renderRow('Departments', item)}
        {this.renderRow('Team Member', item)}
        {this.renderRow('Customer', item)}
        {this.renderRow('Company', item)}
      </CollapseContent>
    ));
  }

  renderContent(formProps: IFormProps) {
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <ContainerBox column gap={40}>
        <ContainerBox row spaceBetween>
          <Title>Movements</Title>
          {this.renderChooser()}
        </ContainerBox>
        {this.renderList(formProps)}
        {renderButton && (
          <ModalFooter>
            <Button btnStyle="simple" onClick={() => closeModal()}>
              Cancel
            </Button>
            {renderButton({
              name: 'asset and movements',
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal
            })}
          </ModalFooter>
        )}
      </ContainerBox>
    );
  }

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
