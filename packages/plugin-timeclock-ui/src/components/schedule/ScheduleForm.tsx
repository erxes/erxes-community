import Button from '@erxes/ui/src/components/Button';
import React, { useState } from 'react';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import DateRange from '../datepicker/DateRange';
import dayjs from 'dayjs';
import DatePicker from '../datepicker/DatePicker';
import { IScheduleForm, IScheduleConfig } from '../../types';
import Select from 'react-select-plus';
import SelectDepartments from '@erxes/ui-settings/src/departments/containers/SelectDepartments';
import {
  CustomLabel,
  FlexCenter,
  FlexColumn,
  FlexRow,
  FlexRowEven,
  MarginX,
  MarginY
} from '../../styles';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { PopoverButton } from '@erxes/ui/src/styles/main';
import Icon from '@erxes/ui/src/components/Icon';

import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { Row } from '../../styles';
import { IBranch } from '@erxes/ui/src/team/types';
import { Alert, __ } from '@erxes/ui/src/utils';
import { compareStartAndEndTime } from '../../utils';
import Datetime from '@nateradebaugh/react-datetime';
import Tip from '@erxes/ui/src/components/Tip';
import { dateFormat, timeFormat } from '../../constants';

type Props = {
  scheduleOfMembers: any;
  queryParams: any;
  history: any;
  branchesList: IBranch[];
  modalContentType: string;
  scheduleConfigs: IScheduleConfig[];
  submitRequest: (
    userId: any,
    filledShifts: any,
    selectedScheduleConfigId?: string
  ) => void;
  submitSchedule: (
    branchIds: any,
    departmentIds: any,
    userIds: any,
    filledShifts: any,
    selectedScheduleConfigId?: string
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

  if (!scheduleConfigs.length) {
    Alert.error('Please add schedule config in configuration section!');
  }

  // prepare schedule configsObject
  const scheduleConfigsObject = {};

  scheduleConfigs.map(scheduleConfig => {
    scheduleConfigsObject[scheduleConfig._id] = scheduleConfig;
  });

  const [selectedScheduleConfigId, setScheduleConfigId] = useState(
    scheduleConfigs[0]._id
  );

  const [scheduleDaysLastIdx, setScheduleDaysLastIdx] = useState(0);

  const [defaultStartTime, setDefaultStartTime] = useState(
    scheduleConfigsObject[selectedScheduleConfigId].shiftStart
  );
  const [defaultEndTime, setDefaultEndTime] = useState(
    scheduleConfigsObject[selectedScheduleConfigId].shiftEnd
  );

  const [dateRangeStart, setDateStart] = useState(new Date());
  const [dateRangeEnd, setDateEnd] = useState(new Date());

  const [scheduleDates, setScheduleDates] = useState<IScheduleForm>({});

  const [contentType, setContentType] = useState('By Date Range');

  const [userIds, setUserIds] = useState([]);
  const [selectedDeptIds, setDepartments] = useState([]);
  const [selectedBranchIds, setBranches] = useState([]);

  const [overlayTrigger, setOverlayTrigger] = useState<any>(null);

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
    setScheduleConfigId(scheduleConfig.value);

    const getScheduleConfig =
      scheduleConfigs &&
      scheduleConfigs.filter(config => config._id === scheduleConfig.value);

    setDefaultStartTime(getScheduleConfig[0].shiftStart);
    setDefaultEndTime(getScheduleConfig[0].shiftEnd);

    Object.keys(scheduleDates).forEach(day_key => {
      const shiftDay = scheduleDates[day_key].shiftDate;

      const getShiftStart = dayjs(
        shiftDay?.toLocaleDateString() + ' ' + getScheduleConfig[0].shiftStart
      ).toDate();

      const getShiftEnd = dayjs(
        shiftDay?.toLocaleDateString() + ' ' + getScheduleConfig[0].shiftEnd
      ).toDate();

      const [
        getCorrectShiftStart,
        getCorrectShiftEnd,
        overNightShift
      ] = compareStartAndEndTime(
        scheduleDates,
        day_key,
        getShiftStart,
        getShiftEnd
      );
      scheduleDates[day_key].shiftStart = getCorrectShiftStart;
      scheduleDates[day_key].shiftEnd = getCorrectShiftEnd;
      scheduleDates[day_key].overnightShift = overNightShift;
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
    setScheduleDaysLastIdx(scheduleDaysLastIdx - 1);
  };

  const onDateChange = (day_key, selectedDate) => {
    const oldShift = scheduleDates[day_key];
    const oldShiftStart = oldShift.shiftStart;
    const oldShiftEnd = oldShift.shiftEnd;

    const [getShiftStart, getShiftEnd, overnight] = compareStartAndEndTime(
      scheduleDates,
      day_key,
      oldShiftStart,
      oldShiftEnd
    );

    const newShift = {
      shiftDate: selectedDate,
      shiftStart: getShiftStart,
      shiftEnd: getShiftEnd,
      overnightShift: overnight,
      lunchBreakInMins: oldShift.lunchBreakInMins,
      scheduleConfigId: oldShift.scheduleConfigId
    };

    delete scheduleDates[day_key];

    const newScheduleDates = { ...scheduleDates, [day_key]: newShift };

    setScheduleDates(newScheduleDates);
  };

  const pickSubset = Object.values(scheduleDates).map(shift => {
    return { shiftStart: shift.shiftStart, shiftEnd: shift.shiftEnd };
  });

  const calculateScheduledDaysAndHours = () => {
    const totalDays = Object.keys(scheduleDates).length;
    let totalHours = 0;

    pickSubset.forEach(shift => {
      totalHours +=
        (shift.shiftEnd.getTime() - shift.shiftStart.getTime()) / (1000 * 3600);
    });

    let totalBreakMins = 0;

    for (const scheduledDateIdx of Object.keys(scheduleDates)) {
      totalBreakMins += scheduleDates[scheduledDateIdx].lunchBreakInMins;
    }

    return [totalDays, totalHours.toFixed(1), (totalBreakMins / 60).toFixed(1)];
  };

  const checkInput = (selectedUsers, shifts, branchIds?, departmentIds?) => {
    if (
      (!branchIds || !branchIds.length) &&
      (!departmentIds || !departmentIds.length) &&
      !selectedUsers.length
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
      submitRequest(
        userIds,
        pickSubset,
        selectedScheduleConfigId.length ? selectedScheduleConfigId : undefined
      );
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
      submitSchedule(
        selectedBranchIds,
        selectedDeptIds,
        userIds,
        pickSubset,
        selectedScheduleConfigId.length ? selectedScheduleConfigId : undefined
      );
      closeModal();
    }
  };
  const onUserSelect = users => {
    setUserIds(users);
  };

  const clearDays = () => {
    setScheduleDates({});
    setScheduleDaysLastIdx(0);
  };

  const addDay = () => {
    // sort array of dates, in order to get the latest day
    let dates_arr = Object.values(scheduleDates).map(shift => shift.shiftDate);
    dates_arr = dates_arr.sort(
      (a, b) => (b?.getTime() || 0) - (a?.getTime() || 0)
    );

    const prevScheduleDates = scheduleDates;

    const getLatestDayKey = dates_arr.length
      ? dayjs(dates_arr[0])
          .add(1, 'day')
          .toDate()
          .toLocaleDateString()
      : new Date().toLocaleDateString();

    const [
      getCorrectShiftStart,
      getCorrectShiftEnd,
      overnight
    ] = compareStartAndEndTime(
      scheduleDates,
      getLatestDayKey,
      new Date(getLatestDayKey + ' ' + defaultStartTime),
      new Date(getLatestDayKey + ' ' + defaultEndTime)
    );

    prevScheduleDates[scheduleDaysLastIdx] = {
      shiftDate: new Date(getLatestDayKey),
      shiftStart: getCorrectShiftStart,
      shiftEnd: getCorrectShiftEnd,
      overnightShift: overnight,
      scheduleConfigId: selectedScheduleConfigId,
      lunchBreakInMins:
        scheduleConfigsObject[selectedScheduleConfigId].lunchBreakInMins
    };

    setScheduleDaysLastIdx(scheduleDaysLastIdx + 1);

    setScheduleDates({
      ...prevScheduleDates
    });
  };

  const onScheduleConfigChange = (
    curr_day_key: string,
    scheduleConfigId: string
  ) => {
    const prevScheduleDates = scheduleDates;

    const shiftDate = dayjs(scheduleDates[curr_day_key].shiftDate).format(
      dateFormat
    );

    const [
      getCorrectShiftStart,
      getCorrectShiftEnd,
      overnight
    ] = compareStartAndEndTime(
      scheduleDates,
      shiftDate,
      new Date(
        shiftDate + ' ' + scheduleConfigsObject[scheduleConfigId].shiftStart
      ),
      new Date(
        shiftDate + ' ' + scheduleConfigsObject[scheduleConfigId].shiftEnd
      )
    );

    prevScheduleDates[curr_day_key] = {
      shiftDate: scheduleDates[curr_day_key].shiftDate,
      shiftStart: getCorrectShiftStart,
      shiftEnd: getCorrectShiftEnd,
      overnightShift: overnight,
      scheduleConfigId,
      lunchBreakInMins: scheduleConfigsObject[scheduleConfigId].lunchBreakInMins
    };

    setScheduleDates({
      ...prevScheduleDates
    });

    setScheduleConfigId(scheduleConfigId);
    setDefaultStartTime(scheduleConfigsObject[scheduleConfigId].shiftStart);
    setDefaultEndTime(scheduleConfigsObject[scheduleConfigId].shiftEnd);
  };

  const renderWeekDays = () => {
    const datePickers: any = [];
    console.log(Object.keys(scheduleDates).length);
    console.log('scheduleDates  ', scheduleDates);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < scheduleDaysLastIdx; i++) {
      datePickers.push(
        <DatePicker
          key={i}
          scheduledDate={scheduleDates[i]}
          selectedScheduleConfigId={scheduleDates[i].scheduleConfigId}
          scheduleConfigOptions={renderScheduleConfigOptions()}
          curr_day_key={i.toString()}
          changeDate={onDateChange}
          removeDate={onRemoveDate}
          changeScheduleConfig={onScheduleConfigChange}
        />
      );
    }
    return <FlexColumn marginNum={5}>{datePickers}</FlexColumn>;
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
    <FlexColumn marginNum={10}>
      <SelectTeamMembers
        queryParams={queryParams}
        label={'Team member'}
        onSelect={onUserSelect}
        multi={false}
        name="userId"
      />
      <Select
        value={selectedScheduleConfigId}
        onChange={onScheduleConfigSelect}
        placeholder="Select Schedule For All"
        multi={false}
        options={renderScheduleConfigOptions()}
      />
      <FlexCenter>
        <CustomLabel>
          {`Total ${calculateScheduledDaysAndHours()[0]} days / ${
            calculateScheduledDaysAndHours()[1]
          } hours `}
        </CustomLabel>
      </FlexCenter>
      {renderWeekDays()}
      {actionButtons('employee')}
    </FlexColumn>
  );

  const adminConfigDefaultContent = () => {
    return (
      <FlexColumn marginNum={10}>
        <div style={{ marginBottom: '0' }}>
          <SelectDepartments
            isRequired={false}
            defaultValue={selectedDeptIds}
            onChange={onDepartmentSelect}
          />
        </div>
        <FormGroup>
          <div style={{ marginBottom: '0' }}>
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
          </div>
        </FormGroup>
        <FormGroup>
          <div style={{ marginBottom: '0' }}>
            <ControlLabel>Team members </ControlLabel>
            <div style={{ width: '100%' }}>
              <SelectTeamMembers
                queryParams={queryParams}
                label={'Select team member'}
                onSelect={onUserSelect}
                name="userId"
              />
            </div>
          </div>
        </FormGroup>

        {/* <FormGroup>
          <div style={{ marginBottom: '0' }}>
            <ControlLabel>Schedules</ControlLabel>
            <Row>
              <Select
                value={selectedScheduleConfigId}
                onChange={onScheduleConfigSelect}
                placeholder="Select schedule for all shifts"
                multi={false}
                options={renderScheduleConfigOptions()}
              />
            </Row>
          </div>
        </FormGroup> */}

        <Select
          value={contentType}
          onChange={onContentTypeSelect}
          placeholder="Select Content Type"
          options={['By Date Range', 'By Date Selection'].map(day => ({
            value: day,
            label: __(day)
          }))}
        />
        <FlexCenter>
          <div style={{ width: '35%' }}>
            <FlexRow>
              <MarginX>
                <FlexColumn marginNum={0}>
                  <CustomLabel>Total days :</CustomLabel>
                  <CustomLabel>Total hours :</CustomLabel>
                  <CustomLabel>Total break:</CustomLabel>
                </FlexColumn>
              </MarginX>
              <FlexColumn marginNum={0}>
                <CustomLabel>{calculateScheduledDaysAndHours()[0]}</CustomLabel>
                <CustomLabel>{calculateScheduledDaysAndHours()[1]}</CustomLabel>
                <CustomLabel>{calculateScheduledDaysAndHours()[2]}</CustomLabel>
              </FlexColumn>
            </FlexRow>
          </div>
          {/*           
          <FlexColumn marginNum={0}>
            <FlexRow>
              <CustomLabel>Total days :</CustomLabel>
              <CustomLabel>{calculateScheduledDaysAndHours()[0]}</CustomLabel>
            </FlexRow>
            <FlexRow>
              <CustomLabel>Total hours:</CustomLabel>
              <CustomLabel>{calculateScheduledDaysAndHours()[1]}</CustomLabel>
            </FlexRow>
            <FlexRow>
              <CustomLabel>Total break:</CustomLabel>
              <CustomLabel>{calculateScheduledDaysAndHours()[2]}'</CustomLabel>
            </FlexRow>
          </FlexColumn> */}
        </FlexCenter>
        {renderAdminConfigSwitchContent()}
        {actionButtons('admin')}
      </FlexColumn>
    );
  };

  const onDateRangeStartChange = (newStart: Date) => {
    setDateStart(newStart);
  };

  const onDateRangeEndChange = (newEnd: Date) => {
    setDateEnd(newEnd);
  };

  const onSaveDateRange = () => {
    const totalDatesArray: string[] = [];

    let temp = dayjs(dateRangeStart);

    const endRange = dayjs(dateRangeEnd);

    while (temp <= endRange) {
      totalDatesArray.push(temp.toDate().toLocaleDateString());
      temp = temp.add(1, 'day');
    }

    const newDatesByRange: IScheduleForm = {};

    // tslint:disable-next-line:prefer-for-of
    for (let dayIdx = 0; dayIdx < totalDatesArray.length; dayIdx++) {
      const eachDay = totalDatesArray[dayIdx];

      const [
        correctShiftStart,
        correctShiftEnd,
        isOvernightShift
      ] = compareStartAndEndTime(
        scheduleDates,
        eachDay,
        new Date(eachDay + ' ' + defaultStartTime),
        new Date(eachDay + ' ' + defaultEndTime),
        eachDay
      );

      newDatesByRange[scheduleDaysLastIdx + dayIdx] = {
        shiftDate: new Date(eachDay),
        shiftStart: correctShiftStart,
        scheduleConfigId: selectedScheduleConfigId,
        lunchBreakInMins:
          scheduleConfigsObject[selectedScheduleConfigId].lunchBreakInMins,
        shiftEnd: correctShiftEnd,
        overnightShift: isOvernightShift
      };
    }

    //  for(const dateKey of newDatesByRange){
    //   if(newDatesByRange[dateKey])
    //  }
    // const difference = Object.keys(newDatesByRange).filter(
    //   x =>
    //     !totalDatesArray.includes(
    //       newDatesByRange[x].shiftDate?.toLocaleDateString()
    //     )
    // );

    // for (const removeKey of difference) {
    //   delete newDatesByRange[removeKey];
    // }

    // console.log('oldd ', scheduleDates);
    console.log(' new dates by range ', newDatesByRange);
    setScheduleDates({ ...newDatesByRange, ...scheduleDates });
    setScheduleDaysLastIdx(scheduleDaysLastIdx + totalDatesArray.length);
  };

  const adminConfigByDateRange = () => {
    return (
      <FlexColumn marginNum={20}>
        <FlexRow>
          <div style={{ width: '78%', marginRight: '0.5rem' }}>
            <DateRange
              showTime={false}
              startDate={dateRangeStart}
              endDate={dateRangeEnd}
              onChangeEnd={onDateRangeEndChange}
              onChangeStart={onDateRangeStartChange}
              onSaveButton={onSaveDateRange}
            />
          </div>
          <FlexRowEven style={{ marginRight: '0.5rem', width: '25%' }}>
            <ControlLabel>{__('Start:')} </ControlLabel>
            <ControlLabel>{__('End:')} </ControlLabel>
            <ControlLabel>{__('Break:')} </ControlLabel>
            <Tip>
              <div>{''}</div>
            </Tip>
          </FlexRowEven>
        </FlexRow>
        {renderWeekDays()}
      </FlexColumn>
    );
  };

  const onDateSelectChange = dateString => {
    if (dateString) {
      const getDate = new Date(dateString).toLocaleDateString();

      // // if date is already selected remove from schedule date
      if (getDate in scheduleDates) {
        delete scheduleDates[getDate];
        setScheduleDates({
          ...scheduleDates
        });
        return;
      }

      const newDates = scheduleDates;

      const [
        correctShiftStart,
        correctShiftEnd,
        isOvernightShift
      ] = compareStartAndEndTime(
        scheduleDates,
        getDate,
        new Date(getDate + ' ' + defaultStartTime),
        new Date(getDate + ' ' + defaultEndTime),
        getDate
      );

      newDates[getDate] = {
        shiftDate: new Date(getDate),
        shiftStart: correctShiftStart,
        shiftEnd: correctShiftEnd,
        overnightShift: isOvernightShift,
        scheduleConfigId: selectedScheduleConfigId,
        lunchBreakInMins:
          scheduleConfigsObject[selectedScheduleConfigId].lunchBreakInMins
      };

      setScheduleDates({ ...newDates });
    }
  };
  {
    /* <DateControl
    required={false}
    name="startDate"
    closeOnSelect={false}
    onChange={onDateSelectChange}
    placeholder={'Select date'}
    dateFormat={'YYYY-MM-DD'}
  /> */
  }

  const closePopover = () => {
    if (overlayTrigger) {
      overlayTrigger.hide();
    }
  };

  const renderDay = (dateTimeProps: any, currentDate) => {
    let isSelected = false;
    if (new Date(currentDate).toLocaleDateString() in scheduleDates) {
      isSelected = true;
    }

    return (
      <td
        {...dateTimeProps}
        className={`rdtDay ${isSelected ? 'rdtActive' : ''}`}
      >
        {new Date(currentDate).getDate()}
      </td>
    );
  };

  const renderDateSelection = () => {
    return (
      <Popover id="schedule-date-select-popover" content={true}>
        <div style={{ position: 'relative' }}>
          <Datetime
            open={true}
            input={false}
            renderDay={renderDay}
            closeOnSelect={false}
            timeFormat={false}
            onChange={onDateSelectChange}
            inputProps={{ required: false }}
          />
          <FlexCenter>
            <MarginY>
              <Button onClick={closePopover}>Close</Button>
            </MarginY>
          </FlexCenter>
        </div>
      </Popover>
    );
  };

  const adminConfigBySelect = () => (
    <>
      <div style={{ position: 'relative', top: '5px' }}>
        <OverlayTrigger
          ref={overlay => setOverlayTrigger(overlay)}
          placement="top-start"
          trigger="click"
          overlay={renderDateSelection()}
          container={this}
          rootClose={this}
        >
          <PopoverButton>
            {__('Please select date')}
            <Icon icon="angle-down" />
          </PopoverButton>
        </OverlayTrigger>
      </div>
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
    case 'adminConfig':
      return adminConfigDefaultContent();
    default:
      return modalContent();
  }
}

export default ScheduleForm;
