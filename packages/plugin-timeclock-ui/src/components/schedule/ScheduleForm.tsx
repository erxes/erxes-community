import Button from '@erxes/ui/src/components/Button';
import React, { useState } from 'react';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import DateRange from '../datepicker/DateRange';
import dayjs from 'dayjs';
import DatePicker from '../datepicker/DateTimePicker';
import { ISchedule, IScheduleConfig } from '../../types';
import Select from 'react-select-plus';
import SelectDepartments from '@erxes/ui-settings/src/departments/containers/SelectDepartments';
import { FlexCenter } from '../../styles';

import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { Row } from '../../styles';
import { IBranch } from '@erxes/ui/src/team/types';
import { CustomRangeContainer } from '../../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { Alert, __ } from '@erxes/ui/src/utils';
import { compareStartAndEndTime } from '../../utils';

type Props = {
  scheduleOfMembers: any;
  queryParams: any;
  history: any;
  branchesList: IBranch[];
  modalContentType: string;
  scheduleConfigs: IScheduleConfig[];
  submitRequest: (userId: string[], filledShifts: any) => void;
  submitSchedule: (
    branchIds: string[],
    departmentIds: string[],
    userIds: string[],
    filledShifts: any
  ) => void;
  closeModal: any;
};

function ScheduleForm(props: Props) {
  const {
    queryParams,
    submitRequest,
    submitSchedule,
    closeModal,
    branchesList,
    modalContentType,
    scheduleConfigs
  } = props;

  const [selectedScheduleConfig, setScheduleConfig] = useState('');
  const [dateKeyCounter, setKeyCounter] = useState('');
  const [userIds, setUserIds] = useState(['']);

  const timeFormat = 'HH:mm';
  const [defaultStartTime, setDefaultStartTime] = useState('08:30:00');
  const [defaultEndTime, setDefaultEndTime] = useState('17:00:00');
  const [dateRangeStart, setDateStart] = useState(new Date());
  const [dateRangeEnd, setDateEnd] = useState(new Date());
  const [scheduleDates, setScheduleDates] = useState<ISchedule>({});
  const [contentType, setContentType] = useState('By Date Range');
  const [selectedDeptIds, setDepartments] = useState(['']);
  const [selectedBranchIds, setBranches] = useState(['']);

  const renderBranchOptions = (branches: any[]) => {
    return branches.map(branch => ({
      value: branch._id,
      label: branch.title,
      userIds: branch.userIds
    }));
  };

  const renderScheduleConfigOptions = () => {
    return scheduleConfigs.map(scheduleConfig => ({
      value: scheduleConfig._id,
      label: `${scheduleConfig.scheduleName}\xa0\xa0\xa0(${scheduleConfig.shiftStart} ~ ${scheduleConfig.shiftEnd})`
    }));
  };

  const onScheduleConfigSelect = scheduleConfig => {
    setScheduleConfig(scheduleConfig);

    const getScheduleConfig =
      scheduleConfigs &&
      scheduleConfigs.filter(config => config._id === scheduleConfig.value);

    setDefaultStartTime(getScheduleConfig[0].shiftStart);
    setDefaultEndTime(getScheduleConfig[0].shiftEnd);

    Object.keys(scheduleDates).forEach(day_key => {
      const shiftDay = scheduleDates[day_key].shiftDate;
      scheduleDates[day_key].shiftStart = dayjs(
        shiftDay?.toLocaleDateString() + ' ' + getScheduleConfig[0].shiftStart
      ).toDate();

      scheduleDates[day_key].shiftEnd = dayjs(
        shiftDay?.toLocaleDateString() + ' ' + getScheduleConfig[0].shiftEnd
      ).toDate();
    });

    setScheduleDates({ ...scheduleDates });
  };

  const onBranchSelect = selectedBranch => {
    const branchIds: any = [];
    branchIds.push(...selectedBranch.map(branch => branch.value));
    setBranches(branchIds);
  };

  const onDepartmentSelect = dept => {
    setDepartments(dept);
  };

  const onRemoveDate = day_key => {
    delete scheduleDates[day_key];
    setScheduleDates({
      ...scheduleDates
    });
    setKeyCounter(Object.keys(scheduleDates).at(-1) || '');
  };

  const onDateChange = (day_key, selectedDate) => {
    const newShift = scheduleDates[day_key];

    const oldShiftEnd = newShift.shiftEnd;
    const oldShiftStart = newShift.shiftStart;

    const newShiftStart = dayjs(
      selectedDate.toLocaleDateString() +
        ' ' +
        dayjs(oldShiftStart).format(timeFormat)
    ).toDate();
    const newShiftEnd = dayjs(
      selectedDate.toLocaleDateString() +
        ' ' +
        dayjs(oldShiftEnd).format(timeFormat)
    ).toDate();

    newShift.shiftDate = selectedDate;
    newShift.shiftStart = newShiftStart;
    newShift.shiftEnd = newShiftEnd;

    const newScheduleDates = { ...scheduleDates, [day_key]: newShift };
    setScheduleDates(newScheduleDates);
  };

  const onStartTimeChange = (day_key, time) => {
    const newShift = scheduleDates[day_key];
    const [
      getCorrectStartTime,
      getCorrectEndTime,
      overnight
    ] = compareStartAndEndTime(scheduleDates, day_key, time, null);

    newShift.shiftStart = getCorrectStartTime;
    newShift.overnightShift = overnight;
    newShift.shiftEnd = getCorrectEndTime;

    const newScheduleDates = { ...scheduleDates, [day_key]: newShift };
    setScheduleDates(newScheduleDates);
  };

  const onEndTimeChange = (day_key, time) => {
    const newShift = scheduleDates[day_key];
    const [
      getCorrectStartTime,
      getCorrectEndTime,
      overnight
    ] = compareStartAndEndTime(scheduleDates, day_key, null, time);

    newShift.shiftStart = getCorrectStartTime;
    newShift.overnightShift = overnight;
    newShift.shiftEnd = getCorrectEndTime;

    const newScheduleDates = { ...scheduleDates, [day_key]: newShift };
    setScheduleDates(newScheduleDates);
  };

  const pickSubset = Object.values(scheduleDates).map(shift => {
    return { shiftStart: shift.shiftStart, shiftEnd: shift.shiftEnd };
  });

  const checkInput = (selectedUsers, shifts, branchIds?, departmentIds?) => {
    if (
      !branchIds &&
      !departmentIds &&
      selectedUsers.length === 1 &&
      selectedUsers[0] === ''
    ) {
      Alert.error('No users were given');
    } else if (shifts.length === 0) {
      Alert.error('No shifts were given');
    } else {
      return true;
    }
  };

  const onSubmitClick = () => {
    const validInput = checkInput(userIds, pickSubset);
    if (validInput) {
      submitRequest(userIds, pickSubset);
      closeModal();
    }
  };
  const onAdminSubmitClick = () => {
    const validInput = checkInput(
      userIds,
      pickSubset,
      selectedBranchIds,
      selectedDeptIds
    );
    if (validInput) {
      submitSchedule(selectedBranchIds, selectedDeptIds, userIds, pickSubset);
      closeModal();
    }
  };
  const onUserSelect = users => {
    setUserIds(users);
  };

  const clearDays = () => {
    setScheduleDates({});
  };

  const addDay = () => {
    // sort array of dates, in order to get the latest day
    let dates_arr = Object.values(scheduleDates).map(shift => shift.shiftDate);
    dates_arr = dates_arr.sort((a, b) => b.getTime() - a.getTime());

    const dates = scheduleDates;
    const getLatestDayKey = dates_arr
      ? dayjs(dates_arr[0])
          .add(1, 'day')
          .toDate()
          .toLocaleDateString()
      : new Date().toLocaleDateString();

    dates[getLatestDayKey] = {
      shiftDate: new Date(getLatestDayKey),
      shiftStart: new Date(getLatestDayKey + ' ' + defaultStartTime),
      shiftEnd: new Date(getLatestDayKey + ' ' + defaultEndTime)
    };

    setScheduleDates({
      ...dates
    });
    setKeyCounter(getLatestDayKey);
  };

  const renderWeekDays = () => {
    return (
      <>
        {Object.keys(scheduleDates).map(date_key => {
          return (
            <DatePicker
              key={date_key}
              startDate={scheduleDates[date_key].shiftDate}
              startTime_value={scheduleDates[date_key].shiftStart}
              endTime_value={scheduleDates[date_key].shiftEnd}
              overnightShift={scheduleDates[date_key].overnightShift}
              curr_day_key={date_key}
              changeDate={onDateChange}
              removeDate={onRemoveDate}
              changeEndTime={onEndTimeChange}
              changeStartTime={onStartTimeChange}
            />
          );
        })}
      </>
    );
  };

  const actionButtons = (userType: string) => {
    return (
      <FlexCenter>
        <Button style={{ marginTop: 10 }} onClick={clearDays}>
          Clear
        </Button>
        <Button style={{ marginTop: 10 }} onClick={addDay}>
          Add day
        </Button>
        <Button
          btnStyle="success"
          style={{ marginTop: 10 }}
          onClick={() =>
            userType === 'admin' ? onAdminSubmitClick() : onSubmitClick()
          }
        >
          {'Submit'}
        </Button>
      </FlexCenter>
    );
  };

  const modalContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <SelectTeamMembers
        queryParams={queryParams}
        label={'Team member'}
        onSelect={onUserSelect}
        multi={false}
        name="userId"
      />
      <Select
        value={selectedScheduleConfig}
        onChange={onScheduleConfigSelect}
        placeholder="Select Schedule"
        multi={false}
        options={renderScheduleConfigOptions()}
      />
      {renderWeekDays()}
      {actionButtons('employee')}
    </div>
  );

  const adminModalContent = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SelectTeamMembers
          queryParams={queryParams}
          label={'Team member'}
          onSelect={onUserSelect}
          name="userId"
        />
        <Select
          value={selectedScheduleConfig}
          onChange={onScheduleConfigSelect}
          placeholder="Select Schedule"
          multi={false}
          options={renderScheduleConfigOptions()}
        />
        {renderWeekDays()}
        {actionButtons('admin')}
      </div>
    );
  };

  const adminConfigDefaultContent = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormGroup>
          <ControlLabel>Branches</ControlLabel>
          <Row>
            <Select
              value={selectedBranchIds}
              onChange={onBranchSelect}
              placeholder="Select branch"
              multi={true}
              options={branchesList && renderBranchOptions(branchesList)}
            />
          </Row>
        </FormGroup>
        <SelectDepartments
          isRequired={false}
          defaultValue={selectedDeptIds}
          onChange={onDepartmentSelect}
        />
        <SelectTeamMembers
          queryParams={queryParams}
          label={'Team member'}
          onSelect={onUserSelect}
          name="userId"
        />
        <Select
          value={selectedScheduleConfig}
          onChange={onScheduleConfigSelect}
          placeholder="Select Schedule"
          multi={false}
          options={renderScheduleConfigOptions()}
        />
        <Select
          value={contentType}
          onChange={onContentTypeSelect}
          placeholder="Select Content Type"
          options={['By Date Range', 'By Date Selection'].map(day => ({
            value: day,
            label: __(day)
          }))}
        />
        {renderAdminConfigSwitchContent()}
        {actionButtons('admin')}
      </div>
    );
  };

  const onDateRangeStartChange = (newStart: Date) => {
    setDateStart(newStart);
  };

  const onDateRangeEndChange = (newEnd: Date) => {
    setDateEnd(newEnd);
  };

  const onSaveDateRange = () => {
    const format = 'YYYY-MM-DD HH:mm';
    const formattedStartDate = dayjs(dateRangeStart).format(format);
    const formattedEndDate = dayjs(dateRangeEnd).format(format);

    const totalDatesArray: string[] = [];

    let temp = dayjs(dateRangeStart);

    const endRange = dayjs(dateRangeEnd);

    while (temp <= endRange) {
      totalDatesArray.push(temp.toDate().toDateString());
      temp = temp.add(1, 'day');
    }

    const newDatesByRange: ISchedule = scheduleDates;

    for (const eachDay of totalDatesArray) {
      newDatesByRange[eachDay] = {
        shiftDate: new Date(eachDay),
        shiftStart: new Date(eachDay + ' ' + defaultStartTime),
        shiftEnd: new Date(eachDay + ' ' + defaultEndTime)
      };

      setKeyCounter(eachDay);
    }

    const difference = Object.keys(newDatesByRange).filter(
      x => !totalDatesArray.includes(x)
    );

    for (const removeKey of difference) {
      delete newDatesByRange[removeKey];
    }

    setScheduleDates(newDatesByRange);
  };

  const adminConfigByDateRange = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <DateRange
          startDate={dateRangeStart}
          endDate={dateRangeEnd}
          onChangeEnd={onDateRangeEndChange}
          onChangeStart={onDateRangeStartChange}
          onSaveButton={onSaveDateRange}
        />
        {renderWeekDays()}
      </div>
    );
  };

  const onDateSelectChange = dateString => {
    if (dateString) {
      const getDate = new Date(dateString).toLocaleDateString();

      const newDates = scheduleDates;

      newDates[getDate] = {
        shiftDate: new Date(getDate),
        shiftStart: new Date(getDate + ' ' + defaultStartTime),
        shiftEnd: new Date(getDate + ' ' + defaultEndTime)
      };

      setScheduleDates(newDates);
      setKeyCounter(getDate);
    }
  };

  const adminConfigBySelect = () => (
    <>
      <CustomRangeContainer>
        <DateControl
          required={false}
          name="startDate"
          onChange={onDateSelectChange}
          placeholder={'Select date'}
          dateFormat={'YYYY-MM-DD'}
        />
      </CustomRangeContainer>
      {renderWeekDays()}
    </>
  );

  const onContentTypeSelect = contntType => {
    localStorage.setItem('contentType', JSON.stringify(contntType));
    const contType = JSON.parse(localStorage.getItem('contentType') || '[]')
      .value;
    setContentType(contType);
  };

  const renderAdminConfigSwitchContent = () => {
    switch (contentType) {
      case 'By Date Selection':
        return adminConfigBySelect();
      default:
        return adminConfigByDateRange();
    }
  };

  switch (modalContentType) {
    case 'admin':
      return adminModalContent();
    case 'adminConfig':
      return adminConfigDefaultContent();
    default:
      return modalContent();
  }
}

export default ScheduleForm;
