import React from 'react';
// erxes
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartment from '@erxes/ui/src/team/containers/SelectDepartments';
import SelectUnits from '@erxes/ui/src/team/containers/SelectUnits';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  formValues: any;
  handleState: (key: string, value: any) => void;
};

const Options = (props: Props) => {
  const { formValues, handleState } = props;

  // Functions
  const renderProductForm = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Departments')}</FormLabel>
        <SelectDepartment
          name="departmentIds"
          label="Choose Departments"
          initialValue={formValues.departmentIds || []}
          onSelect={departments => handleState('departmentIds', departments)}
          multi={true}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>{__('Branches')}</FormLabel>
        <SelectBranches
          name="branchIds"
          label="Choose Branches"
          initialValue={formValues.branchIds || []}
          onSelect={branches => handleState('branchIds', branches)}
          multi={true}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>{__('Units')}</FormLabel>
        <SelectUnits
          name="unitIds"
          label="Choose Units"
          initialValue={formValues.unitIds || []}
          onSelect={units => handleState('unitIds', units)}
          multi={true}
        />
      </FormGroup>
    </>
  );

  return (
    <FlexItem>
      <LeftItem>{renderProductForm()}</LeftItem>
    </FlexItem>
  );
};

export default Options;
