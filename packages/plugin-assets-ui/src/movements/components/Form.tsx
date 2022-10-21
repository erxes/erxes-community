import {
  BarItems,
  Bulk,
  Button,
  CollapseContent,
  DateControl,
  Form as CommonForm,
  FormControl,
  ModalTrigger,
  SelectTeamMembers,
  Table,
  __
} from '@erxes/ui/src';

import { ContentColumn, ItemRow, ItemText } from '@erxes/ui-cards/src/deals/styles';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import client from '@erxes/ui/src/apolloClient';
import { DateContainer, FormColumn, FormWrapper, ModalFooter } from '@erxes/ui/src/styles/main';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import _loadash from 'lodash';
import React from 'react';
import { IMovementItem, IMovementType } from '../../common/types';
import { CommonFormGroup, CommonItemRow } from '../../common/utils';
import { ContainerBox, MovementItemContainer, MovementTableWrapper } from '../../style';
import AssetChooser from '../containers/Chooser';
import { queries } from '../graphql';
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
  selectedItemIds: string[];
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
      variables: detail?.items || [],
      selectedItemIds: detail?.selectedAssetIds || [],
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
      const selectedItemIds = datas.map(data => data._id);
      client
        .query({
          query: gql(queries.itemsCurrentLocation),
          fetchPolicy: 'network-only',
          variables: { assetIds: selectedItemIds }
        })
        .then(res => {
          const { currentAssetMovementItems } = res.data;
          this.setState({ selectedItemIds });

          const selectedItems = datas.map(data => ({
            assetId: data._id,
            assetName: data.name
          }));

          const newVariables = selectedItems.map(selectedItem => {
            const newItem = currentAssetMovementItems.find(
              item => item.assetId === selectedItem.assetId
            );
            if (newItem) {
              return newItem;
            }
            return selectedItem;
          });

          this.setState({ variables: newVariables });
        });
    };

    const updatedProps = {
      ...props,
      handleSelect,
      selectedAssetIds: this.state.selectedItemIds
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
        item.assetId === asset.assetId
          ? { ...item, [field]: selected === '' ? null : selected }
          : item
      );
      this.setState({ variables });
    };

    return (
      <td key={label} className="item">
        <ItemRow>
          <ItemText>{label}</ItemText>
          <ContentColumn flex="3">
            <MovementItemContainer>
              <Selection
                label={`Choose ${label}`}
                onSelect={handleChange}
                initialValue={value || ''}
                multi={false}
                customOption={{ value: '', label: 'No option' }}
              />
            </MovementItemContainer>
          </ContentColumn>
        </ItemRow>
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

  handleChangeRowItem = (prevItemId, newItem) => {
    const { variables } = this.state;
    const newVariables = variables.map(item => (item.assetId === prevItemId ? newItem : item));
    const removedSeletedItemIds = this.state.selectedItemIds.filter(item => item !== prevItemId);
    this.setState({
      variables: newVariables,
      selectedItemIds: [...removedSeletedItemIds, newItem.assetId]
    });
  };

  renderGeneral() {
    const { variables, general, checkedItems } = this.state;

    const handleGeneralOptions = (value, field) => {
      this.setState({ currentItems: [] });

      const newVariables = variables.map(item =>
        checkedItems.includes(item.assetId)
          ? { ...item, [field]: value === '' ? null : value }
          : item
      );
      this.setState({
        variables: newVariables,
        general: { ...general, [field]: value === '' ? null : value }
      });
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
                    customOption={{ value: '', label: 'No option' }}
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
                    customOption={{ value: '', label: 'No option' }}
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
                    customOption={{ value: '', label: 'No option' }}
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
                    customOption={{ value: '', label: 'No option' }}
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
                customOption={{ value: '', label: 'No option' }}
              />
            </CommonItemRow>
          </ContentColumn>
        </BarItems>
      </CollapseContent>
    );
  }

  renderList = props => {
    const { variables, currentItems, selectedItemIds } = this.state;

    const removeRow = id => {
      const newVariables = variables.filter(item => item.assetId !== id);
      const newSelectedItems = selectedItemIds.filter(itemId => itemId !== id);
      if (currentItems.includes(id)) {
        const newCurrentItems = currentItems.filter(item => item !== id);
        this.setState({ currentItems: newCurrentItems });
      }
      this.setState({ variables: newVariables, selectedItemIds: newSelectedItems });
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
                selectedItems={selectedItemIds}
                toggleBulk={props.toggleBulk}
                isChecked={props.bulk.some(bulk => bulk.assetId === item.assetId)}
                onChangeBulkItems={onChangeCheckedItems}
                handleChangeRowItem={this.handleChangeRowItem}
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

          <Bulk content={this.renderList} />
          <ContainerBox justifyCenter>
            {this.assetChooserContent(<Button icon="plus-circle">{__('Add Asset')}</Button>)}
          </ContainerBox>
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
