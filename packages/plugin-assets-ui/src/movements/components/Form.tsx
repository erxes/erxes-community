import {
  BarItems,
  Bulk,
  Button,
  CollapseContent,
  DateControl,
  EmptyState,
  Form as CommonForm,
  FormControl,
  ModalTrigger,
  SelectTeamMembers,
  Table,
  __
} from '@erxes/ui/src';

import { ContentColumn } from '@erxes/ui-cards/src/deals/styles';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import { Title } from '@erxes/ui-settings/src/styles';
import { DateContainer, FormColumn, FormWrapper, ModalFooter } from '@erxes/ui/src/styles/main';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import _loadash from 'lodash';
import React from 'react';
import { IAsset, IMovementItem, IMovementType } from '../../common/types';
import { CommonFormGroup, CommonItemRow } from '../../common/utils';
import { ContainerBox, MovementItemContainer, MovementTableWrapper } from '../../style';
import AssetChooser from '../containers/Chooser';
import MovementItems from './MovementItem';

type Props = {
  detail: IMovementType;
  assetId?: string;
  closeModal: () => void;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
};

type General = {
  branchId?: string;
  departmentId?: string;
  customerId?: string;
  companyId?: string;
  teamMemberId?: string;
};

type State = {
  variables: IMovementItem[];
  currentItems: string[];
  description: string;
  movedAt: string;
  selectedItems: IAsset[];
  general: General;
  checkedItems: string[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.changeCurrentItem = this.changeCurrentItem.bind(this);

    const { detail, assetId } = props;

    this.state = {
      variables: detail?.assets || [],
      selectedItems: detail?.selectedItems || [],
      description: detail?.description || '',
      movedAt: detail?.movedAt || '',
      currentItems: [assetId],
      general: {},
      checkedItems: []
    };
  }

  generateDoc() {
    const { variables, movedAt, description } = this.state;
    const { detail } = this.props;
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
    const doc = { items, description, movedAt };
    if (!_loadash.isEmpty(detail)) {
      return { _id: detail._id, doc };
    }
    return { ...doc };
  }

  assetChooser(props) {
    const handleSelect = datas => {
      const { variables } = this.state;

      this.setState({ selectedItems: datas });
      const newVariables = datas.map(data => {
        const item = variables.find(item => item.assetId === data._id);
        if (item) {
          return item;
        }
        return { ...data?.currentMovement, assetId: data._id, assetName: data.name };
      });
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

  renderRow(label, asset, value) {
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
            initialValue={value || ''}
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

  handleGeneralDate = e => {
    this.setState({ movedAt: e });
  };

  handleGeneralDescription = e => {
    const { value } = e.currentTarget as HTMLInputElement;

    this.setState({ description: value });
  };
  handleChangeRowItem = (prevId, newItem) => {
    let { selectedItems, variables } = this.state;
    selectedItems = selectedItems.map(item => (item._id === prevId ? newItem : item));
    const currentMovement = newItem?.currentMovement;
    variables = variables.map(item =>
      item.assetId === prevId
        ? { assetId: newItem._id, assetName: newItem.name, ...currentMovement }
        : item
    );
    this.setState({ selectedItems, variables });
  };
  renderGeneral() {
    const { variables, general, checkedItems } = this.state;

    const handleGeneralOptions = (value, field) => {
      this.setState({ currentItems: [] });

      const newVariables = variables.map(item =>
        checkedItems.includes(item.assetId) ? { ...item, [field]: value } : item
      );
      this.setState({ variables: newVariables, general: { ...general, [field]: value } });
    };

    return (
      <CollapseContent
        title="General Location Configrations"
        description={__(
          'If you want to change the location generally of your selected assets, you should click checkboxes below.'
        )}
      >
        <BarItems>
          <ContentColumn>
            <FormWrapper>
              <FormColumn>
                <CommonItemRow label="Branch">
                  <SelectBranches
                    label="Choose Branch"
                    name="branchId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.branchId}
                  />
                </CommonItemRow>
              </FormColumn>
              <FormColumn>
                <CommonItemRow label="Department">
                  <SelectDepartments
                    label="Choose Department"
                    name="departmentId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.departmentId}
                  />
                </CommonItemRow>
              </FormColumn>
            </FormWrapper>
            <FormWrapper>
              <FormColumn>
                <CommonItemRow label="Customer">
                  <SelectCustomers
                    label="Choose Customer"
                    name="customerId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.customerId}
                  />
                </CommonItemRow>
              </FormColumn>
              <FormColumn>
                <CommonItemRow label="Company">
                  <SelectCompanies
                    label="Choose Company"
                    name="companyId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.companyId}
                  />
                </CommonItemRow>
              </FormColumn>
            </FormWrapper>
            <CommonItemRow label="Team Member">
              <SelectTeamMembers
                label="Choose Team Member"
                name="teamMemberId"
                onSelect={handleGeneralOptions}
                multi={false}
                initialValue={general?.teamMemberId}
              />
            </CommonItemRow>
          </ContentColumn>
        </BarItems>
      </CollapseContent>
    );
  }

  renderList = props => {
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

    const onChange = () => {
      const { checkedItems } = this.state;
      const newCheckedItems = variables.map(item => item.assetId);
      this.setState({ checkedItems: checkedItems.length > 0 ? [] : newCheckedItems });
      props.toggleAll(variables, 'variables');
    };

    const onChangeCheckedItems = (id: string, checked: boolean) => {
      if (!checked) {
        const newCheckedItems = this.state.checkedItems.filter(item => item !== id);
        return this.setState({ checkedItems: newCheckedItems });
      }
      this.setState(prev => ({ checkedItems: [...prev.checkedItems, id] }));
    };

    return (
      <MovementTableWrapper>
        <Table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <FormControl
                  checked={props.isAllSelected}
                  componentClass="checkbox"
                  onChange={onChange}
                  color="#3B85F4"
                />
              </th>
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
                onsSelect={this.handleChangeRowItem}
                selectedItems={selectedItems}
                toggleBulk={props.toggleBulk}
                isChecked={props.bulk.some(bulk => bulk.assetId === item.assetId)}
                onChangeBulkItems={onChangeCheckedItems}
              >
                {this.renderRow('Branches', item, item['branchId'])}
                {this.renderRow('Departments', item, item['departmentId'])}
                {this.renderRow('Customer', item, item['customerId'])}
                {this.renderRow('Company', item, item['companyId'])}
                {this.renderRow('Team Member', item, item['teamMemberId'])}
              </MovementItems>
            ))}
          </tbody>
        </Table>
      </MovementTableWrapper>
    );
  };
  render() {
    const renderContent = (formProps: IFormProps) => {
      const { closeModal, renderButton, assetId, detail } = this.props;
      const { values, isSubmitted } = formProps;
      const { movedAt, description, variables } = this.state;

      return (
        <ContainerBox column gap={20}>
          <Title>Movements</Title>
          <FormWrapper>
            <FormColumn>
              <CommonFormGroup label="Date">
                <DateContainer>
                  <DateControl
                    placeholder="Select Date"
                    onChange={this.handleGeneralDate}
                    value={movedAt}
                  />
                </DateContainer>
              </CommonFormGroup>
            </FormColumn>
            <FormColumn>
              <CommonFormGroup label="Description">
                <FormControl
                  type="text"
                  name="description"
                  onChange={this.handleGeneralDescription}
                  value={description}
                  required
                />
              </CommonFormGroup>
            </FormColumn>
          </FormWrapper>

          {variables.length > 0 && this.renderGeneral()}
          <CollapseContent title="Asset List" open={!!assetId}>
            <Bulk content={this.renderList} />
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
                text: 'Movement',
                values: this.generateDoc(),
                isSubmitted,
                callback: closeModal,
                object: !_loadash.isEmpty(detail)
              })}
            </ModalFooter>
          )}
        </ContainerBox>
      );
    };

    return <CommonForm renderContent={renderContent} />;
  }
}

export default Form;
