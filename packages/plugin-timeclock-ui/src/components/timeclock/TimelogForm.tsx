import React from 'react';
import Select from 'react-select-plus';
import { ControlLabel } from '@erxes/ui/src/components/form';
import { CustomRangeContainer, FlexColumn } from '../../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { ITimeclock, ITimelog } from '../../types';

type Props = {
  timeclock: ITimeclock;
  timelogsPerUser: ITimelog[];
};
const TimelogForm = (props: Props) => {
  const { timeclock, timelogsPerUser } = props;

  const onShiftStartChange = (selectedTime: Date) => {};

  const onShiftEndChange = (selectedTime: Date) => {};

  const generateSelectOptions = () => {
    return timelogsPerUser.map(timelog => {
      value: timelogsPerUser;
    });
  };
  return (
    <FlexColumn marginNum={20}>
      <Select
        placeholder="Shift start"
        onChange={onShiftStartChange}
        value={timeclock && timeclock.shiftStart}
        options={timelogsPerUser && generateSelectOptions}
      />

      <Select
        placeholder="Shift end"
        onChange={onShiftEndChange}
        value={timeclock && timeclock.shiftEnd}
        options={timelogsPerUser && generateSelectOptions}
      />
    </FlexColumn>
  );
};
