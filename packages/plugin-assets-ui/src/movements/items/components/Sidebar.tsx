import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import {
  Button,
  ControlLabel,
  DateControl,
  FormGroup as CommonFormGroup,
  Icon,
  router,
  Sidebar as CommonSideBar,
  Tip
} from '@erxes/ui/src';
import { DateContainer } from '@erxes/ui/src/styles/main';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import moment from 'moment';
import React from 'react';
import { SelectWithAssets } from '../../../common/utils';
import { ContainerBox, CustomRangeContainer, EndDateContainer } from '../../../style';

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  branchId?: string;
  departmentId?: string;
  teamMemberId?: string;
  companyId?: string;
  customerId?: string;
  assetId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
};

class Sidebar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { queryParams } = props;

    this.state = {
      ...queryParams
    };
  }

  render() {
    const {
      branchId,
      departmentId,
      teamMemberId,
      companyId,
      customerId,
      assetId,
      createdAtFrom,
      createdAtTo
    } = this.state;

    const FormGroup = ({
      label,
      field,
      clearable,
      children
    }: {
      label: string;
      field: string | string[];
      clearable?: boolean;
      children: React.ReactNode;
    }) => {
      const clearParams = field => {
        if (Array.isArray(field)) {
          field.forEach(name => {
            this.setState({ [name]: undefined });
            return router.removeParams(this.props.history, name);
          });
        }
        this.setState({ [field]: undefined });
        router.removeParams(this.props.history, field);
      };
      return (
        <CommonFormGroup>
          <ContainerBox row spaceBetween>
            <ControlLabel>{label}</ControlLabel>
            {clearable && (
              <Button btnStyle="link" onClick={() => clearParams(field)}>
                <Tip placement="bottom" text="Clear">
                  <Icon icon="cancel-1" />
                </Tip>
              </Button>
            )}
          </ContainerBox>
          {children}
        </CommonFormGroup>
      );
    };

    const handleSelect = (value, name) => {
      if (['createdAtFrom', 'createdAtTo'].includes(name)) {
        value = moment(value).format(`YYYY/MM/DD hh:mm`);
      }

      this.setState({ [name]: value });
      router.setParams(this.props.history, { [name]: value });
      router.setParams(this.props.history, { page: 1 });
    };

    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <FormGroup label="Branch" field="branchId" clearable={!!branchId}>
            <SelectBranches
              label="Choose Branch"
              name="branchId"
              multi={false}
              initialValue={branchId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Branch' }}
            />
          </FormGroup>
          <FormGroup label="Department" field="departmentId" clearable={!!departmentId}>
            <SelectDepartments
              label="Choose Department"
              name="departmentId"
              multi={false}
              initialValue={departmentId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Department' }}
            />
          </FormGroup>
          <FormGroup label="Team Member" field="teamMemberId" clearable={!!teamMemberId}>
            <SelectCompanies
              label="Choose Team Member"
              name="teamMemberId"
              multi={false}
              initialValue={teamMemberId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Team Member' }}
            />
          </FormGroup>
          <FormGroup label="Company" field="companyId" clearable={!!companyId}>
            <SelectCompanies
              label="Choose Company"
              name="companyId"
              multi={false}
              initialValue={companyId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Company' }}
            />
          </FormGroup>
          <FormGroup label="Customer" field="customerId" clearable={!!customerId}>
            <SelectCustomers
              label="Choose Customer"
              name="customerId"
              multi={false}
              initialValue={customerId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Customer' }}
            />
          </FormGroup>
          <FormGroup label="Asset" field="assetId" clearable={!!assetId}>
            <SelectWithAssets
              label="Choose Asset"
              name="assetId"
              multi={false}
              initialValue={assetId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Choose Asset' }}
            />
          </FormGroup>
          <FormGroup
            label="Created Date Range"
            clearable={!!createdAtFrom || !!createdAtTo}
            field={['createdAtFrom', 'createdAtTo']}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="createdAtFrom"
                  placeholder="Choose start date"
                  value={createdAtFrom}
                  onChange={e => handleSelect(e, 'createdAtFrom')}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="createdAtTo"
                    placeholder="Choose end date"
                    value={createdAtTo}
                    onChange={e => handleSelect(e, 'createdAtTo')}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}

export default Sidebar;
