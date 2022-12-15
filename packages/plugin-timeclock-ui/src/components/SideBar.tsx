import { router, __ } from '@erxes/ui/src/utils';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import React, { useState } from 'react';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import { SidebarActions, SidebarHeader } from '../styles';
import { CustomRangeContainer } from '../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import Button from '@erxes/ui/src/components/Button';
import SelectDepartments from '@erxes/ui-settings/src/departments/containers/SelectDepartments';
import Select from 'react-select-plus';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IBranch } from '@erxes/ui/src/team/types';

type Props = {
  queryParams: any;
  queryUserIds: string[];
  history: any;
  branchesList: IBranch[];
};

const LeftSideBar = (props: Props) => {
  const { history, branchesList, queryParams, queryUserIds } = props;

  console.log(branchesList);

  const { userIds } = queryParams;
  const [currUserIds, setUserIds] = useState(userIds);
  const [selectedBranchId, setBranches] = useState(['']);
  const [deptIds, setDeptIds] = useState(['']);

  const renderBranchOptions = (branches: any[]) => {
    return branches.map(branch => ({
      value: branch._id,
      label: branch.title,
      userIds: branch.userIds
    }));
  };

  const onBranchSelect = selectedBranch => {
    setBranches(selectedBranch);
    const branchUsers: string[] = [];

    const branchIds: any[] = [];
    selectedBranch.map(branch => {
      branchIds.push(branch.value);
      branchUsers.push(...branch.userIds);
    });

    // router.setParams(history, {
    //   branchIds: `${branchIds}`,
    //   userIds: branchUsers
    // });

    setUserIds(branchUsers);
  };

  const onDepartmentSelect = dept => {
    setDeptIds(dept);
    router.setParams(history, {
      departmentIds: dept
    });
  };

  const onMemberSelect = selectedUsers => {
    setUserIds(selectedUsers);
    router.setParams(history, {
      userIds: selectedUsers
    });
  };

  const renderSidebarActions = () => {
    return (
      <SidebarHeader>
        <CustomRangeContainer>
          <DateControl
            required={false}
            name="startDate"
            placeholder={'Starting date'}
            dateFormat={'YYYY-MM-DD'}
          />
          <DateControl
            required={false}
            name="startDate"
            placeholder={'Ending date'}
            dateFormat={'YYYY-MM-DD'}
          />
          <Button btnStyle="primary">Filter</Button>
        </CustomRangeContainer>
      </SidebarHeader>
    );
  };

  const renderSidebarHeader = () => {
    return <SidebarActions>{renderSidebarActions()}</SidebarActions>;
  };

  return (
    <Sidebar wide={true} hasBorder={true} header={renderSidebarHeader()}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '20px 20px',
          gap: '10px'
        }}
      >
        <SelectTeamMembers
          initialValue={currUserIds}
          label="Team member"
          name="userIds"
          queryParams={queryParams}
          onSelect={onMemberSelect}
        />
        <SelectDepartments
          isRequired={false}
          defaultValue={deptIds}
          onChange={onDepartmentSelect}
        />
        <div>
          <ControlLabel>Branches</ControlLabel>
          <Select
            value={selectedBranchId}
            onChange={onBranchSelect}
            placeholder="Select branch"
            multi={true}
            options={branchesList && renderBranchOptions(branchesList)}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default LeftSideBar;
