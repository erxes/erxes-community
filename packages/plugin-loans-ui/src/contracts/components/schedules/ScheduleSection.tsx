import { __, Box, Icon, Alert, confirm } from '@erxes/ui/src';
import React from 'react';

import SchedulesList from '../../containers/Schedules';
import { ScrollTableColls } from '../../styles';

type Props = {
  contractId: string;
  isFirst: boolean;
  regenSchedules: (contractId: string) => void;
  fixSchedules: (contractId: string) => void;
};

function ScheduleSection({
  contractId,
  isFirst,
  regenSchedules,
  fixSchedules
}: Props) {
  const onRegenSchedules = () =>
    confirm()
      .then(() => regenSchedules(contractId))
      .catch(error => {
        Alert.error(error.message);
      });

  const onFixSchedules = () =>
    confirm()
      .then(() => fixSchedules(contractId))
      .catch(error => {
        Alert.error(error.message);
      });

  const renderExtraButton = () => {
    if (isFirst) {
      return <></>;
    }
    return (
      <>
        <button onClick={onRegenSchedules} title="create schedule">
          <a>Recreate Schedule</a>
        </button>
        <button onClick={onFixSchedules} title={'fix schedule'}>
          <Icon icon="refresh-1" />
        </button>
      </>
    );
  };

  return (
    <Box
      title={__(`${(isFirst && 'First ') || ''}Schedules`)}
      name="showSchedules"
      isOpen={!isFirst}
      extraButtons={renderExtraButton()}
    >
      <ScrollTableColls>
        <SchedulesList
          contractId={contractId}
          isFirst={isFirst}
        ></SchedulesList>
      </ScrollTableColls>
    </Box>
  );
}

export default ScheduleSection;
