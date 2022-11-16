import React, { useState } from 'react';
// erxes
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  formValues: any;
  handleState: (key: string, value: any) => void;
};

const Schedules = (props: Props) => {
  const { formValues, handleState } = props;

  // Hooks
  const [isSchedule, setSchedule] = useState<boolean>(false);

  // Functions
  const renderScheduleToggle = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Set schedule')}</FormLabel>
        <FormControl
          name="schedule"
          componentClass="checkbox"
          onChange={(e: any) => setSchedule(e.target.checked)}
        />
      </FormGroup>
    </>
  );

  const renderScheduler = () => {
    if (isSchedule) return <></>;
  };

  return (
    <FlexItem>
      <LeftItem>
        {renderScheduleToggle()}
        {renderScheduler()}
      </LeftItem>
    </FlexItem>
  );
};

export default Schedules;
