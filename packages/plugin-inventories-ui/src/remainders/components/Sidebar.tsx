import React from 'react';
// erxes
import { __, router } from '@erxes/ui/src/utils/core';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Box from '@erxes/ui/src/components/Box';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
// local
import CategoryFilter from '../containers/CategoryFilter';
import { SidebarContent } from '../../styles';

type Props = {
  queryParams: any;
  history: any;
};

export default function Sidebar(props: Props) {
  const { queryParams, history } = props;

  const setFilter = (name: string, value: any) => {
    router.setParams(history, { [name]: value });
  };

  return (
    <Wrapper.Sidebar>
      <Box title={__('Selectors')} isOpen={true} name="showSelectors">
        <SidebarContent>
          <FormGroup>
            <ControlLabel>Branch</ControlLabel>
            <SelectBranches
              label="Choose branch"
              name="selectedBranchIds"
              initialValue={queryParams.branchId}
              onSelect={branchId => setFilter('branchId', branchId)}
              multi={false}
              customOption={{ value: '', label: 'All branches' }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Department</ControlLabel>
            <SelectDepartments
              label="Choose department"
              name="selectedDepartmentIds"
              initialValue={queryParams.departmentId}
              onSelect={departmentId => setFilter('departmentId', departmentId)}
              multi={false}
              customOption={{ value: '', label: 'All departments' }}
            />
          </FormGroup>
        </SidebarContent>
      </Box>
      <CategoryFilter />
    </Wrapper.Sidebar>
  );
}
