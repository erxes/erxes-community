import React from 'react';
import { ControlLabel } from '@erxes/ui/src/components/form';
import { FlexColumn } from '../../styles';

const TimelogForm = () => {
  return (
    <FlexColumn marginNum={20}>
      <ControlLabel>{shiftTime}</ControlLabel>

      <CustomRangeContainer>
        <DateControl
          value={timeLogStartDate}
          name="startDate"
          placeholder={'Starting date'}
          dateFormat={'YYYY-MM-DD'}
          onChange={onLogStartDateChange}
        />
        <DateControl
          value={timeLogEndDate}
          name="endDate"
          placeholder={'Ending date'}
          dateFormat={'YYYY-MM-DD'}
          onChange={onLogEndDateChange}
        />
      </CustomRangeContainer>
      {this.renderTimeLogs()}
    </FlexColumn>
  );
};
