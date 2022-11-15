import React, { useState } from 'react';
import Datetime from '@nateradebaugh/react-datetime';
// erxes
import Table from '@erxes/ui/src/components/table';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { DateContainer } from '@erxes/ui/src/styles/main';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  formValues: any;
  handleState: (key: string, value: any) => void;
};

const Schedules = (props: Props) => {
  const { formValues, handleState } = props;

  // Hooks
  const [isSchedule, setSchedule] = useState<boolean>(false);
  const [isDateRange, setDateRange] = useState<boolean>(false);

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

  const renderDateRangeToggle = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Set date range')}</FormLabel>
        <FormControl
          name="dateRange"
          componentClass="checkbox"
          onChange={(e: any) => setDateRange(e.target.checked)}
        />
      </FormGroup>
    </>
  );

  const renderScheduler = () => {
    if (isSchedule) return <></>;
  };

  const renderDateRanger = () => {
    if (isDateRange)
      return (
        <Table bordered condensed responsive>
          <tbody>
            <tr>
              <td>
                <FormGroup>
                  <FormLabel>{__('Start Date')}</FormLabel>
                  <FormControl componentClass="checkbox" name="startDate" />
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <DateContainer>
                    <Datetime
                      inputProps={{ placeholder: __('Select Date') }}
                      dateFormat="MM/DD/YYYY"
                      closeOnSelect={true}
                      timeFormat={false}
                      utc={true}
                    />
                  </DateContainer>
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <DateContainer>
                    <Datetime
                      inputProps={{ placeholder: __('Select Time') }}
                      dateFormat={false}
                      closeOnSelect={true}
                      timeFormat={true}
                      utc={true}
                    />
                  </DateContainer>
                </FormGroup>
              </td>
            </tr>
            <tr>
              <td>
                <FormGroup>
                  <FormLabel>{__('End Date')}</FormLabel>
                  <FormControl componentClass="checkbox" name="startDate" />
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <DateContainer>
                    <Datetime
                      inputProps={{ placeholder: __('Select Date') }}
                      dateFormat="MM/DD/YYYY"
                      closeOnSelect={true}
                      timeFormat={false}
                      utc={true}
                    />
                  </DateContainer>
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <DateContainer>
                    <Datetime
                      inputProps={{ placeholder: __('Select Time') }}
                      dateFormat={false}
                      closeOnSelect={true}
                      timeFormat={true}
                      utc={true}
                    />
                  </DateContainer>
                </FormGroup>
              </td>
            </tr>
          </tbody>
        </Table>
      );
  };

  return (
    <FlexItem>
      <LeftItem>
        {renderScheduleToggle()}
        {renderScheduler()}
        {renderDateRangeToggle()}
        {renderDateRanger()}
      </LeftItem>
    </FlexItem>
  );
};

export default Schedules;
