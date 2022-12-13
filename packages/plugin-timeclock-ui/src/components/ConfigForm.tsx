import Button from '@erxes/ui/src/components/Button';
import { __, router } from '@erxes/ui/src/utils';
import React, { useState } from 'react';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import {
  CustomRangeContainer,
  FlexRow,
  FlexColumn,
  FlexCenter
} from '../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import { IAbsence, IAbsenceType, IPayDates, ISchedule } from '../types';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import DateRange from './DateRange';
import dayjs from 'dayjs';

type Props = {
  history: any;
  configType: string;
  absenceType?: IAbsenceType;
  holiday?: IAbsence;
  payDate?: IPayDates;
  absenceTypes?: IAbsenceType[];
  loading?: boolean;
  afterSave?: () => void;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => void;
  submitPayDatesConfig: (payDates: number[]) => void;
};

function ConfigForm(props: Props) {
  const { renderButton, submitPayDatesConfig, history } = props;
  const { absenceType, holiday } = props;
  const [explanationRequired, setExplRequired] = useState(false);
  const [attachmentRequired, setAttachRequired] = useState(false);
  const [payPeriod, setPayPeriod] = useState('');

  const [dateRangeStart, setDateStart] = useState(new Date());
  const [dateRangeEnd, setDateEnd] = useState(new Date());
  const [scheduleDates, setScheduleDates] = useState<ISchedule>({});
  const [dateKeyCounter, setKeyCounter] = useState('');

  const [payDates, setpayDates] = useState({
    date1: new Date(),
    date2: new Date()
  });

  const { afterSave, closeModal } = props;

  const togglePayPeriod = e => {
    setPayPeriod(e.target.value);
  };
  const toggleExplRequired = e => {
    setExplRequired(e.target.checked);
  };
  const toggleAttachRequired = e => {
    setAttachRequired(e.target.checked);
  };

  const onSubmitPayDatesConfig = () => {
    payPeriod === 'twice'
      ? submitPayDatesConfig([
          payDates.date1.getDate(),
          payDates.date2.getDate()
        ])
      : submitPayDatesConfig([payDates.date1.getDate()]);
  };

  const onConfigDateChange = (dateNum: string, newDate: Date) => {
    payDates[dateNum] = newDate;
    setpayDates({ ...payDates });
  };

  const onHolidayStartDateChange = (newStart: Date) => {
    setDateStart(newStart);
  };
  const onHolidayEndDateChange = (newEnd: Date) => {
    setDateEnd(newEnd);
  };

  const onHolidaySaveDateRange = () => {
    const format = 'YYYY-MM-DD HH:mm';
    const formattedStartDate = dayjs(dateRangeStart).format(format);
    const formattedEndDate = dayjs(dateRangeEnd).format(format);

    router.setParams(history, {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

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
        shiftStart: new Date(eachDay),
        shiftEnd: new Date(eachDay)
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

  const addHoliday = () => {
    const dates = scheduleDates;
    const getLatestDayKey = dateKeyCounter
      ? dayjs(dateKeyCounter)
          .add(1, 'day')
          .toDate()
          .toDateString()
      : new Date().toDateString();

    dates[getLatestDayKey] = {
      shiftStart: new Date(getLatestDayKey),
      shiftEnd: new Date(getLatestDayKey)
    };

    setScheduleDates(dates);
    setKeyCounter(getLatestDayKey);
  };
  const renderHolidays = () => {
    console.log(scheduleDates);

    return (
      <>
        {Object.keys(scheduleDates).map(date_key => {
          return (
            <CustomRangeContainer key={date_key}>
              <DateControl
                value={scheduleDates[date_key].shiftStart}
                required={false}
                name="startDate"
                // onChange={onSelectDateChange}
                placeholder={'Starting date'}
                dateFormat={'YYYY-MM-DD'}
              />
            </CustomRangeContainer>
          );
        })}
      </>
    );
  };

  const generateDoc = (
    values: {
      _id?: string;
      holidayName?: string;
      startDate?: Date;
      endDate?: Date;
      absenceName: string;
      explRequired: boolean;
      attachRequired: boolean;
    },
    name: string
  ) => {
    if (name === 'absenceType') {
      if (absenceType) {
        values._id = absenceType._id;
      }

      return {
        name: values.absenceName,
        explRequired: explanationRequired,
        attachRequired: attachmentRequired,
        _id: values._id
      };
    }

    if (name === 'holiday') {
      if (holiday) {
        values._id = holiday._id;
      }

      return {
        _id: values._id,
        name: values.holidayName,
        startDate: values.startDate,
        endDate: values.endDate
      };
    }
  };

  const renderConfigContent = () => {
    const { configType } = props;
    switch (configType) {
      case 'Schedule':
        return <Form renderContent={renderScheduleContent} />;
      case 'Holiday':
        return <Form renderContent={renderHolidayContent} />;
      // Absence
      default:
        return <Form renderContent={renderAbsenceContent} />;
    }
  };

  const renderAbsenceContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <FlexColumn>
        <ControlLabel required={true}>Name</ControlLabel>
        <FormControl
          {...formProps}
          name="absenceName"
          defaultValue={absenceType && absenceType.name}
          required={true}
          autoFocus={true}
        />
        <FlexRow>
          <ControlLabel>Explanation Required</ControlLabel>
          <FormControl
            name="explRequired"
            componentClass="checkbox"
            defaultChecked={absenceType?.explRequired}
            onChange={toggleExplRequired}
          />
        </FlexRow>
        <FlexRow>
          <ControlLabel>Attachment Required</ControlLabel>
          <FormControl
            name="attachRequired"
            componentClass="checkbox"
            defaultChecked={absenceType?.attachRequired}
            onChange={toggleAttachRequired}
          />
        </FlexRow>
        <FlexCenter style={{ marginTop: '10px' }}>
          {renderButton({
            name: 'absenceType',
            values: generateDoc(values, 'absenceType'),
            isSubmitted,
            callback: closeModal || afterSave,
            object: absenceType || null
          })}
        </FlexCenter>
      </FlexColumn>
    );
  };

  const renderScheduleContent = () => (
    <FlexColumn>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ControlLabel>Pay period</ControlLabel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: '10px'
          }}
        >
          <div>Once</div>
          <FormControl
            rows={2}
            name="payPeriod"
            componentClass="radio"
            options={['once', 'twice'].map(el => ({
              value: el
            }))}
            inline={true}
            onChange={togglePayPeriod}
          />
          <div>Twice</div>
        </div>
      </div>
      <CustomRangeContainer>
        {payPeriod === '' ? (
          <></>
        ) : (
          <>
            <DateControl
              value={payDates.date1}
              required={false}
              onChange={val => onConfigDateChange('date1', val)}
              placeholder={'Enter date'}
              dateFormat={'YYYY-MM-DD'}
            />
            {payPeriod === 'twice' ? (
              <DateControl
                value={payDates.date2}
                required={false}
                onChange={val => onConfigDateChange('date2', val)}
                placeholder={'Enter date'}
                dateFormat={'YYYY-MM-DD'}
              />
            ) : (
              <></>
            )}
          </>
        )}
      </CustomRangeContainer>
      <FlexCenter>
        <Button onClick={onSubmitPayDatesConfig} disabled={payPeriod === ''}>
          Submit
        </Button>
      </FlexCenter>
    </FlexColumn>
  );

  const renderHolidayContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    return (
      <FlexColumn>
        <ControlLabel required={true}>Holiday Name</ControlLabel>
        <FormControl
          {...formProps}
          name="holidayName"
          defaultValue={holiday && holiday.holidayName}
          required={true}
          autoFocus={true}
        />
        <DateRange
          startDate={dateRangeStart}
          endDate={dateRangeEnd}
          onChangeEnd={onHolidayEndDateChange}
          onChangeStart={onHolidayStartDateChange}
          onSaveButton={onHolidaySaveDateRange}
        />
        {renderHolidays()}
        <FlexCenter style={{ marginTop: '10px' }}>
          <Button btnStyle="primary" onClick={addHoliday}>
            Add day
          </Button>
          {renderButton({
            name: 'absenceType',
            values: generateDoc(values, 'holiday'),
            isSubmitted,
            callback: closeModal || afterSave,
            object: absenceType || null
          })}
        </FlexCenter>
      </FlexColumn>
    );
  };
  return renderConfigContent();
}

export default ConfigForm;
