import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import { ITimeclock, ITimelog } from '../../types';
import { __ } from '@erxes/ui/src/utils';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import TimeForm from '../../containers/timeclock/TimeFormList';
import dayjs from 'dayjs';
import { dateFormat, timeFormat } from '../../constants';
import Tip from '@erxes/ui/src/components/Tip';
import { returnDeviceTypes } from '../../utils';
import { CustomRangeContainer, FlexColumn } from '../../styles';
import { ControlLabel } from '@erxes/ui/src/components/form';
import { setParams } from '@erxes/ui/src/utils/router';
import DateControl from '@erxes/ui/src/components/form/DateControl';

type Props = {
  history: any;
  timelogsPerUser: ITimelog[];
  timeclock: ITimeclock;
  removeTimeclock: (_id: string) => void;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  setUserId = () => {
    console.log('kakakkaka');
    // setParams(this.props.history, { timeclockUser: selectedUserId });
  };

  shiftTrigger = shiftStarted =>
    shiftStarted ? (
      <Button id="timeClockButton1" btnStyle={'danger'} icon="plus-circle">
        End shift
      </Button>
    ) : (
      <>Ended</>
    );

  shiftBtnTrigger = shiftStarted => (
    <ModalTrigger
      title={__('Start shift')}
      trigger={this.shiftTrigger(shiftStarted)}
      content={this.modalContent}
    />
  );

  modalContent = props => (
    <TimeForm
      {...props}
      selectedUserId={
        this.props.timeclock.user ? this.props.timeclock.user._id : null
      }
      shiftId={this.props.timeclock._id}
      shiftStarted={this.props.timeclock.shiftActive}
    />
  );

  renderTimeLogs = () => {
    const { timelogsPerUser } = this.props;
  };

  editShiftTimeContent = (shiftTime: string, userId: string) => {
    return (
      <FlexColumn marginNum={20}>
        <ControlLabel>{shiftTime}</ControlLabel>

        {/* <CustomRangeContainer>
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
        </CustomRangeContainer> */}
        {this.renderTimeLogs()}
      </FlexColumn>
    );
  };

  editShiftTime = (shiftTime: string, userId: string) => {
    return (
      <div style={{ cursor: 'pointer' }} onClick={this.setUserId}>
        {shiftTime}
      </div>
    );
  };

  editShiftTimeTrigger = (
    timeclockId: string,
    userId: string,
    shiftTime: string,
    timeType?: string
  ) => {
    return (
      <ModalTrigger
        title={__(`Edit ${timeType}`)}
        trigger={this.editShiftTime(shiftTime, userId)}
        content={() => this.editShiftTimeContent(shiftTime, userId)}
      />
    );
  };

  render() {
    const { timeclock, removeTimeclock } = this.props;
    const shiftStartTime = dayjs(timeclock.shiftStart).format(timeFormat);
    const shiftDate =
      new Date(timeclock.shiftStart).toDateString().split(' ')[0] +
      '\t' +
      dayjs(timeclock.shiftStart).format(dateFormat);

    const shiftEndTime = timeclock.shiftEnd
      ? dayjs(timeclock.shiftEnd).format(timeFormat)
      : '-';

    const overNightShift =
      timeclock.shiftEnd &&
      new Date(timeclock.shiftEnd).toLocaleDateString() !==
        new Date(timeclock.shiftStart).toLocaleDateString();

    return (
      <tr>
        <td>
          {timeclock.user && timeclock.user.details
            ? timeclock.user.details.fullName ||
              `${timeclock.user.details.firstName} ${timeclock.user.details.lastName}`
            : timeclock.employeeUserName || timeclock.employeeId}
        </td>
        <td>{shiftDate}</td>
        <td>
          {this.editShiftTimeTrigger(
            timeclock._id,
            timeclock.user._id,
            shiftStartTime,
            'Shift Start'
          )}
        </td>
        <td>{returnDeviceTypes(timeclock.deviceType)[0]}</td>
        <td>
          {this.editShiftTimeTrigger(
            timeclock._id,
            timeclock.user._id,
            shiftEndTime,
            'Shift End'
          )}
        </td>
        <td>{returnDeviceTypes(timeclock.deviceType)[1]}</td>
        <td>{overNightShift ? 'O' : ''}</td>
        <td>
          {timeclock.branchName ? timeclock.branchName : timeclock.deviceName}
        </td>
        <td>{this.shiftBtnTrigger(timeclock.shiftActive)}</td>
        <td>
          <Tip text={__('Delete')} placement="top">
            <Button
              btnStyle="link"
              onClick={() => removeTimeclock(timeclock._id)}
              icon="times-circle"
            />
          </Tip>
        </td>
      </tr>
    );
  }
}

export default Row;
