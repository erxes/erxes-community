import Button from '@erxes/ui/src/components/Button';
import { menuTimeClock } from '../menu';
import { __ } from '@erxes/ui/src/utils';
import React, { useState, useEffect } from 'react';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import SideBarList from '../containers/SideBarList';
import TimeForm from '../containers/TimeFormList';
import ConfigList from '../containers/ConfigList';
import TimeclockList from '../containers/TimeclockList';
import AbsenceList from '../containers/AbsenceList';
import ReportList from '../containers/ReportList';
import ScheduleList from '../containers/ScheduleList';
import { IBranch } from '@erxes/ui/src/team/types';

type Props = {
  currentDate?: string;
  currentUserId: string;
  queryParams: any;
  history: any;
  route?: string;
  startTime?: Date;
  startClockTime?: (userId: string) => void;
  loading: boolean;
  branchesList: IBranch[];
};

function List(props: Props) {
  const {
    startClockTime,
    branchesList,
    currentUserId,
    queryParams,
    history,
    route
  } = props;

  const [rightActionBar, setRightActionBar] = useState(<div />);
  const [Component, setModalComponent] = useState(<div />);
  const [loading, setLoading] = useState(true);

  const trigger = (
    <Button id="btn1" btnStyle={'success'} icon="plus-circle">
      {`Start Shift`}
    </Button>
  );

  const modalContent = contentProps => (
    <TimeForm
      {...contentProps}
      currentUserId={currentUserId}
      startClockTime={startClockTime}
    />
  );

  const actionBarRight = (
    <>
      <ModalTrigger
        title={__('Start shift')}
        trigger={trigger}
        content={modalContent}
      />
    </>
  );

  const title = (
    <Title capitalize={true}>
      {__(new Date().toDateString().slice(0, -4))}
    </Title>
  );

  useEffect(() => {
    switch (route) {
      case 'config':
        setModalComponent(
          <ConfigList
            getActionBar={setRightActionBar}
            queryParams={queryParams}
            history={history}
          />
        );
        setLoading(false);

        break;
      case 'report':
        setModalComponent(
          <ReportList
            // departmentIds={departmentIds ? departmentIds.split(',') : null}
            // branchIds={branchIds ? branchIds.split(',') : null}
            // queryStartDate={startDate}
            // queryEndDate={endDate}
            // queryUserId={userId}
            {...props}
            getActionBar={setRightActionBar}
            queryParams={queryParams}
            history={history}
          />
        );
        setLoading(false);
        break;

      case 'schedule':
        setModalComponent(
          <ScheduleList
            getActionBar={setRightActionBar}
            queryParams={queryParams}
            history={history}
          />
        );
        setLoading(false);
        break;
      case 'requests':
        setModalComponent(
          <AbsenceList
            // queryStartDate={startDate}
            // queryEndDate={endDate}
            getActionBar={setRightActionBar}
            queryParams={queryParams}
            history={history}
          />
        );
        setLoading(false);
        break;
      default:
        setModalComponent(
          <TimeclockList
            // queryStartDate={startDate}
            // queryEndDate={endDate}
            // queryUserIds={userIds ? userIds.split(',') : null}
            getActionBar={setRightActionBar}
            history={history}
            queryParams={queryParams}
          />
        );
        setLoading(false);
    }
  }, [queryParams]);

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Timeclocks')} submenu={menuTimeClock} />
      }
      actionBar={rightActionBar}
      content={
        <DataWithLoader
          data={Component}
          loading={loading}
          emptyText={__('Theres no timeclock')}
          emptyImage="/images/actions/8.svg"
        />
      }
      leftSidebar={
        <SideBarList
          branchesList={branchesList}
          queryParams={queryParams}
          history={history}
        />
      }
      transparent={true}
      hasBorder={true}
    />
  );
}

export default List;
