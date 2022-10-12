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
  Form as CommonForm,
  Table,
  FormGroup,
  ControlLabel,
  DateControl
} from '@erxes/ui/src';

import React from 'react';
import { IAsset, IMovementType, IMovementItem } from '../../common/types';
import AssetForm from '../../asset/containers/Form';
import { Title } from '@erxes/ui-settings/src/styles';
import { ContainerBox, MovementItemContainer, MovementTableWrapper } from '../../style';
import AssetChooser from '../containers/Chooser';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import _loadash from 'lodash';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import { DateContainer, ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import MovementItems from './MovementItem';
import { ContentColumn, Divider, ItemRow } from '@erxes/ui-cards/src/deals/styles';
import { CommonFormGroup, CommonItemRow } from '../../common/utils';
type Props = {
  detail: IMovementType;
  closeModal: () => void;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  variables: IMovementItem[];
  currentItems: string[];
  description: string;
  movedAt: string;
  selectedItems: IAsset[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.changeCurrentItem = this.changeCurrentItem.bind(this);

    this.state = {
      variables: props.detail?.assets || [],
      selectedItems: props.detail?.selectedItems || [],
      description: props.detail?.description || '',
      movedAt: props.detail?.movedAt || '',
      currentItems: []
    };
  }

  generateDoc(values) {
    const { variables, movedAt, description } = this.state;
    const items = variables.map(
      ({ assetId, assetName, branchId, departmentId, customerId, companyId, teamMemberId }) => ({
        assetId,
        assetName,
        branchId,
        departmentId,
        customerId,
        companyId,
        teamMemberId
      })
    );
    return { movements: items, description, movedAt };
  }

  assetChooser(props) {
    const handleSelect = datas => {
      this.setState({ selectedItems: datas });

      const newVariables = datas.map(data => ({
        ...data?.currentMovement,
        assetId: data._id,
        assetName: data.name
      }));
      this.setState({ variables: newVariables });
    };

    const updatedProps = {
      ...props,
      handleSelect,
      selected: this.state.selectedItems
    };

    return <AssetChooser {...updatedProps} />;
  }

  assetChooserTrigger = (<Button>Select Assets</Button>);

  assetChooserContent(trigger) {
    return (
      <ModalTrigger title="Select Assets" content={this.assetChooser} trigger={trigger} size="lg" />
    );
  }

  renderChooser() {
    return <>{this.assetChooserContent(this.assetChooserTrigger)}</>;
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
      variables = variables.map(item =>
        item.assetId === asset.assetId ? { ...item, [field]: selected } : item
      );
      this.setState({ variables });
    };

    return (
      <td key={label} className="item">
        <MovementItemContainer>
          <Selection
            label={`Choose ${label}`}
            onSelect={handleChange}
            initialValue={asset[field] || ''}
            multi={false}
          />
        </MovementItemContainer>
      </td>
    );
  }

  changeCurrentItem(id: string) {
    const { currentItems } = this.state;

    if (currentItems.includes(id)) {
      const newCurrentItems = currentItems.filter(item => item !== id);
      return this.setState({ currentItems: newCurrentItems });
    }

    this.setState(prev => ({ currentItems: [...prev.currentItems, id] }));
  }

  renderList(formProps: IFormProps) {
    const { variables, currentItems, selectedItems } = this.state;

    if (variables.length === 0) {
      return <EmptyState text="No Selected Asset" image="/images/actions/5.svg" />;
    }

    const removeRow = id => {
      const newVariables = variables.filter(item => item.assetId !== id);
      const newSelectedItems = selectedItems.filter(item => item._id !== id);
      if (currentItems.includes(id)) {
        const newCurrentItems = currentItems.filter(item => item !== id);
        this.setState({ currentItems: newCurrentItems });
      }
      this.setState({ variables: newVariables, selectedItems: newSelectedItems });
    };

    return (
      <MovementTableWrapper>
        <Table>
          <thead>
            <tr>
              <th>{__('Name')}</th>
              <th>{__('Branch')}</th>
              <th>{__('Departmnet')}</th>
              <th>{__('Customer')}</th>
              <th>{__('Comapny')}</th>
              <th>{__('Team Member')}</th>
            </tr>
          </thead>
          <tbody>
            {variables.map(item => (
              <MovementItems
                key={item.assetId}
                item={item}
                current={currentItems.includes(item.assetId) ? item.assetId : ''}
                changeCurrent={this.changeCurrentItem}
                removeRow={removeRow}
              >
                {this.renderRow('Branches', item)}
                {this.renderRow('Departments', item)}
                {this.renderRow('Team Member', item)}
                {this.renderRow('Customer', item)}
                {this.renderRow('Company', item)}
              </MovementItems>
            ))}
          </tbody>
        </Table>
      </MovementTableWrapper>
    );
  }

  renderGeneral() {
    const { movedAt, description, variables } = this.state;

    const handleGeneralOptions = (value, field) => {
      const newVariables = variables.map(item => ({ ...item, [field]: value }));
      this.setState({ variables: newVariables });
    };

    const handleGeneralDate = e => {
      this.setState({ movedAt: e });
    };

    const handleGeneralDescription = e => {
      const { value } = e.currentTarget as HTMLInputElement;

      this.setState({ description: value });
    };

    return (
      <CollapseContent title="General Options">
        <ContainerBox column>
          <CommonFormGroup label="Date">
            <DateContainer>
              <DateControl placeholder="Select Date" onChange={handleGeneralDate} value={movedAt} />
            </DateContainer>
          </CommonFormGroup>
        </ContainerBox>
        <CommonFormGroup label="Description">
          <FormControl
            componentClass="textarea"
            name="description"
            onChange={handleGeneralDescription}
            value={description}
            required
          />
        </CommonFormGroup>
        {variables.length > 0 && (
          <BarItems>
            <ContentColumn>
              <CommonItemRow label="Branch">
                <SelectBranches
                  label="Choose Branch"
                  name="branchId"
                  onSelect={handleGeneralOptions}
                  multi={false}
                />
              </CommonItemRow>
              <CommonItemRow label="Department">
                <SelectDepartments
                  label="Choose Department"
                  name="departmentId"
                  onSelect={handleGeneralOptions}
                  multi={false}
                />
              </CommonItemRow>
              <CommonItemRow label="Customer">
                <SelectCustomers
                  label="Choose Customer"
                  name="customerId"
                  onSelect={handleGeneralOptions}
                  multi={false}
                />
              </CommonItemRow>
              <CommonItemRow label="Company">
                <SelectCompanies
                  label="Choose Company"
                  name="companyId"
                  onSelect={handleGeneralOptions}
                  multi={false}
                />
              </CommonItemRow>
              <CommonItemRow label="Team Member">
                <SelectTeamMembers
                  label="Choose Team Member"
                  name="teamMemberId"
                  onSelect={handleGeneralOptions}
                  multi={false}
                />
              </CommonItemRow>
            </ContentColumn>
          </BarItems>
        )}
      </CollapseContent>
    );
  }

  renderContent(formProps: IFormProps) {
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <ContainerBox column gap={20}>
        <Title>Movements</Title>
        {this.renderGeneral()}
        <CollapseContent title="Asset List">
          {this.renderList(formProps)}
          <ContainerBox justifyCenter>
            {this.assetChooserContent(<Button icon="plus-circle">{__('Add Asset')}</Button>)}
          </ContainerBox>
        </CollapseContent>
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
