import React, { useState } from 'react';
import Select from 'react-select-plus';
import { ControlLabel, FormControl } from '@erxes/ui/src/components/form';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import {
  CustomWidthDiv,
  FlexCenter,
  FlexColumn,
  FlexRow,
  ToggleDisplay,
  FlexRowEven,
  TextAlignRight,
  CustomRangeContainer
} from '../../styles';
import { IAbsence, ITimeclock, ITimelog } from '../../types';
import dayjs from 'dayjs';
import { dateDayFormat, dateFormat } from '../../constants';
import Button from '@erxes/ui/src/components/Button';
import { Alert } from '@erxes/ui/src/utils';
import { timeFormat } from '../../constants';

type Props = {
  timeclocksPerUser: ITimeclock[];
  timelogsPerUser: ITimelog[];

  absenceRequest: IAbsence;

  timeType: string;
  editTimeclock: (timeclockId: string, timeValue: any) => void;
  createTimeclock: (timeValues: any) => void;
};

function CheckoutForm(props: Props) {
  const {
    timeclocksPerUser,
    timelogsPerUser,
    timeType,
    absenceRequest,
    editTimeclock
  } = props;

  const isCheckOutRequest = timeType.includes('check out');

  const [pickTimeclockType, setPickTimeclockType] = useState('');
  const [shiftStartInput, setShiftStartInput] = useState(null);
  const [shiftStart, setShiftStart] = useState(absenceRequest.startTime);
  const [selectedTimeclockId, setSelectedTimeclockId] = useState(null);

  const returnAbsenceRequestTimeFormatted = () => {
    const getDate = dayjs(absenceRequest.startTime).format(dateDayFormat);
    const getTime = dayjs(absenceRequest.startTime).format(timeFormat);

    return getDate + ' ' + getTime;
  };
  const toggleTimeclockType = e => {
    setPickTimeclockType(e.target.value);
  };

  const toggleShiftStartInput = e => {
    setShiftStartInput(e.target.value);
  };

  const returnDateTimeFormatted = (time: any, type: string) => {
    if (type === 'timeclock') {
      const getShiftDate = dayjs(time.shiftStart).format(dateFormat);
      const getShiftStart = dayjs(time.shiftStart).format(timeFormat);
      const getShiftEnd = time.shiftEnd
        ? dayjs(time.shiftEnd).format(timeFormat)
        : 'N/A';

      return getShiftDate + ' ' + getShiftStart + ' ' + getShiftEnd;
    }

    const getDate = dayjs(time.timelog).format(dateFormat);
    const getTime = dayjs(time.timelog).format(timeFormat);

    return getDate + ' ' + getTime;
  };

  const generateTimeclockSelectOptionsForShiftStart = () => {
    const filterShiftsOfThatDay = timeclocksPerUser.filter(
      timeclock =>
        dayjs(timeclock.shiftStart).format(dateFormat) ===
        dayjs(absenceRequest.startTime).format(dateFormat)
    );

    return filterShiftsOfThatDay.map(timeclock => ({
      value: timeclock._id,
      label: returnDateTimeFormatted(timeclock, 'timeclock')
    }));
  };

  const generateTimeclockSelectOptionsForShiftEnd = () => {
    return timeclocksPerUser.map(timeclock => ({
      value: timeclock._id,
      label: returnDateTimeFormatted(timeclock, 'timeclock')
    }));
  };

  const generateTimelogOptions = () => {
    return timelogsPerUser.map((log: ITimelog) => ({
      value: log.timelog,
      label: returnDateTimeFormatted(log, 'timelog')
    }));
  };

  const generateRadioOptions = () => {
    const options = ['pick', 'insert'];

    return options.map(el => ({
      value: el
    }));
  };

  const onSelectTimeclock = selectedTime => {
    setSelectedTimeclockId(selectedTime.value);
  };

  const onShiftStartChange = (selectedTime: any) => {
    if (shiftStartInput === 'pick') {
      setShiftStart(selectedTime.value);
      return;
    }
    setShiftStart(selectedTime);
  };

  const checkInput = () => {
    if (pickTimeclockType === 'pick' && !selectedTimeclockId) {
      Alert.error('Please pick timeclock fromt the list');
      return false;
    }

    return true;
  };

  const onSaveBtn = () => {
    if (pickTimeclockType === 'pick' && checkInput() && selectedTimeclockId) {
      if (timeType === 'check in') {
        editTimeclock(selectedTimeclockId, {
          shiftStart: pickTimeclockType
        });
        return;
      }
      editTimeclock(selectedTimeclockId, { shiftEnd: pickTimeclockType });
      return;
    }
  };

  return (
    <FlexColumn marginNum={20}>
      <div style={{ fontSize: '16px' }}>
        {returnAbsenceRequestTimeFormatted()}
      </div>
      <FlexRow>
        {isCheckOutRequest ? (
          <ControlLabel>Shift End</ControlLabel>
        ) : (
          <ControlLabel>Shift Start</ControlLabel>
        )}
        <FlexRowEven>
          <CustomWidthDiv width={120}>
            <TextAlignRight>Pick timeclock</TextAlignRight>
          </CustomWidthDiv>
          <FormControl
            rows={2}
            name="pickTimeclockType"
            componentClass="radio"
            options={generateRadioOptions()}
            inline={true}
            onChange={toggleTimeclockType}
          />
          <CustomWidthDiv width={140}>Insert new timeclock</CustomWidthDiv>
        </FlexRowEven>
      </FlexRow>

      <ToggleDisplay display={pickTimeclockType === 'pick'}>
        <Select
          placeholder="Pick timeclock"
          onChange={onSelectTimeclock}
          value={selectedTimeclockId}
          options={
            timeclocksPerUser && isCheckOutRequest
              ? generateTimeclockSelectOptionsForShiftEnd()
              : generateTimeclockSelectOptionsForShiftStart()
          }
        />
      </ToggleDisplay>

      <ToggleDisplay
        display={pickTimeclockType === 'insert' && isCheckOutRequest}
      >
        <FlexRow>
          <ControlLabel>Shift Start</ControlLabel>
          <FlexRowEven>
            <CustomWidthDiv width={120}>
              <TextAlignRight>Pick from time logs</TextAlignRight>
            </CustomWidthDiv>
            <FormControl
              rows={2}
              name="shiftStartInput"
              componentClass="radio"
              options={['pick', 'insert'].map(el => ({
                value: el
              }))}
              inline={true}
              onChange={toggleShiftStartInput}
            />
            <CustomWidthDiv width={140}>Insert custom date</CustomWidthDiv>
          </FlexRowEven>
        </FlexRow>

        <ToggleDisplay display={shiftStartInput === 'pick'}>
          <Select
            placeholder="Pick shift start"
            onChange={onShiftStartChange}
            value={shiftStart}
            options={timelogsPerUser && generateTimelogOptions()}
          />
        </ToggleDisplay>
        <ToggleDisplay display={shiftStartInput === 'insert'}>
          <CustomRangeContainer>
            <DateControl
              value={shiftStart}
              timeFormat={'HH:mm'}
              name="startDate"
              placeholder={'Starting date'}
              dateFormat={'YYYY-MM-DD'}
              onChange={onShiftStartChange}
            />
          </CustomRangeContainer>
        </ToggleDisplay>
      </ToggleDisplay>

      <FlexCenter>
        <Button btnStyle="primary" onClick={onSaveBtn}>
          Submit
        </Button>
      </FlexCenter>
    </FlexColumn>
  );
}

export default CheckoutForm;
