import React from 'react';
import {
  Sidebar as CommonSideBar,
  FormGroup as CommonFormGroup,
  ControlLabel,
  router,
  Button,
  Tip,
  Icon,
  DateControl
} from '@erxes/ui/src';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';
import { DateContainer } from '@erxes/ui/src/styles/main';
import { ContainerBox } from '../../../style';

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
  from?: string;
  to?: string;
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
    const { branchId, departmentId, teamMemberId, companyId, customerId, from, to } = this.state;

    const FormGroup = ({
      label,
      field,
      clearable,
      children
    }: {
      label: string;
      field: string;
      clearable?: boolean;
      children: React.ReactNode;
    }) => {
      const clearParams = () => {
        this.setState({ [field]: undefined });
        router.removeParams(this.props.history, field);
      };
      return (
        <CommonFormGroup>
          <ContainerBox row spaceBetween>
            <ControlLabel>{label}</ControlLabel>
            {clearable && (
              <Button btnStyle="link" onClick={clearParams}>
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
      if (['from', 'to'].includes(name)) {
        value = new Date(value);
      }

      this.setState({ [name]: value });
      router.setParams(this.props.history, { [name]: value });
    };

    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <FormGroup label="Branch" field="branchId" clearable={!!branchId}>
            <SelectBranches label="Choose Branch" name="branchId" multi={false} initialValue={branchId} onSelect={handleSelect} />
          </FormGroup>
          <FormGroup label="Department" field="departmentId" clearable={!!departmentId}>
            <SelectDepartments
              label="Choose Department"
              name="departmentId"
              multi={false}
              initialValue={departmentId}
              onSelect={handleSelect}
            />
          </FormGroup>
          <FormGroup label="Team Member" field="teamMemberId" clearable={!!teamMemberId}>
            <SelectCompanies
              label="Choose Team Member"
              name="teamMemberId"
              multi={false}
              initialValue={teamMemberId}
              onSelect={handleSelect}
            />
          </FormGroup>
          <FormGroup label="Company" field="companyId" clearable={!!companyId}>
            <SelectCompanies
              label="Choose Company"
              name="companyId"
              multi={false}
              initialValue={companyId}
              onSelect={handleSelect}
            />
          </FormGroup>
          <FormGroup label="Customer" field="customerId" clearable={!!customerId}>
            <SelectCustomers
              label="Choose Customer"
              name="customerId"
              multi={false}
              initialValue={customerId}
              onSelect={handleSelect}
            />
          </FormGroup>
          <FormGroup label="From" clearable={!!from} field="from">
            <DateContainer>
              <DateControl name="from" placeholder="Choose start date" value={from} onChange={e => handleSelect(e, 'from')} />
            </DateContainer>
          </FormGroup>
          <FormGroup label="To" clearable={!!to} field="to">
            <DateContainer>
              <DateControl name="to" placeholder="Choose end date" value={to} onChange={e => handleSelect(e, 'to')} />
            </DateContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}

export default Sidebar;
