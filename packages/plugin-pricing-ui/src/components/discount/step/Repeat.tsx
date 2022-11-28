import React, { useState, useEffect } from 'react';
import Datetime from '@nateradebaugh/react-datetime';
import Select from 'react-select-plus';
// erxes
import Button from '@erxes/ui/src/components/Button';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import Toggle from '@erxes/ui/src/components/Toggle';
import Tip from '@erxes/ui/src/components/Tip';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils';
import {
  DateContainer,
  FormWrapper,
  FormColumn
} from '@erxes/ui/src/styles/main';
// local
import { Table } from '../../../styles';
import { WEEK_OPTIONS, REPEAT_OPTIONS } from '../../../constants';
import { DiscountData } from '../../../types';

type Props = {
  formValues: DiscountData;
  handleState: (key: string, value: any) => void;
};

export default function Repeat(props: Props) {
  const { formValues, handleState } = props;

  // Hooks
  const [weekValue, setWeekValue] = useState<any>([]);
  const [monthValue, setMonthValue] = useState<any>([]);

  // Functions
  const handleChange = (index: number, key: string, value: any) => {
    const temp = [...formValues.repeatRules];
    temp[index][key] = value;

    handleState('repeatRules', temp);
  };

  const handleAdd = () => {
    const temp = [...formValues.repeatRules];
    temp.push({ type: 'everyDay' });
    handleState('repeatRules', temp);
  };

  const handleDelete = (index: number) => {
    const temp = [...formValues.repeatRules];
    if (temp.length >= 1) temp.splice(index, 1);
    handleState('repeatRules', temp);
  };

  const renderWeekForm = (item: any, index: number) => (
    <FormGroup>
      <Select
        placeholder={__('Select a weekday')}
        value={weekValue}
        options={WEEK_OPTIONS}
        name="weekForm"
        onChange={(value: any) => setWeekValue(value)}
        multi
      />
    </FormGroup>
  );

  const renderMonthForm = (item: any, index: number) => {
    let options: any = [];

    options.push({ label: 'Last day of the month', value: 'monthLastDay' });

    for (let i = 1; i <= 31; i++) {
      options.push({
        value: i.toString(),
        label: i
      });
    }

    return (
      <FormGroup>
        <Select
          placeholder={__('Select a day')}
          value={monthValue}
          options={options}
          onChange={(value: any) => setMonthValue(value)}
          name="monthForm"
          multi
        />
      </FormGroup>
    );
  };

  const renderYearForm = (item: any, index: number) => (
    <FormWrapper>
      <FormColumn>
        <FormGroup>
          <DateContainer>
            <Datetime
              inputProps={{ placeholder: __('Start Date') }}
              dateFormat="MM/DD/YYYY"
              closeOnSelect={true}
              timeFormat={false}
              utc={true}
              value={formValues.startDate || undefined}
              onChange={(date: any) => handleState('startDate', date)}
            />
          </DateContainer>
        </FormGroup>
      </FormColumn>
      <FormColumn>
        <FormGroup>
          <DateContainer>
            <Datetime
              inputProps={{ placeholder: __('End Date') }}
              dateFormat="MM/DD/YYYY"
              closeOnSelect={true}
              timeFormat={false}
              utc={true}
              value={formValues.endDate || undefined}
              onChange={(date: any) => handleState('endDate', date)}
            />
          </DateContainer>
        </FormGroup>
      </FormColumn>
    </FormWrapper>
  );

  const renderInputForm = (item: any, index: number) => {
    switch (item.type) {
      case 'everyDay':
        return;
      case 'everyWeek':
        return renderWeekForm(item, index);
      case 'everyMonth':
        return renderMonthForm(item, index);
      case 'everyYear':
        return renderYearForm(item, index);
      default:
        return (
          <FormGroup>
            <FormControl
              type="text"
              name="value"
              placeholder="Value (e.g. 1,4,25,31)"
            />
          </FormGroup>
        );
    }
  };

  const renderRow = (item: any, index: number) => (
    <tr>
      <td>
        <FormGroup>
          <FormControl
            name="type"
            componentClass="select"
            options={REPEAT_OPTIONS}
            onChange={(e: any) => handleChange(index, 'type', e.target.value)}
            value={item.type || 'everyDay'}
          />
        </FormGroup>
      </td>
      <td>{renderInputForm(item, index)}</td>
      <td>
        <Tip text={__('Delete')} placement="bottom">
          <Button
            btnStyle="danger"
            icon="trash"
            size="small"
            onClick={() => handleDelete(index)}
          />
        </Tip>
      </td>
    </tr>
  );

  const renderToggle = () => (
    <FormGroup>
      <FormLabel>{__('Set repeat')}</FormLabel>
      <Toggle
        checked={formValues.isRepeatEnabled}
        onChange={(e: any) => handleState('isRepeatEnabled', e.target.checked)}
      />
    </FormGroup>
  );

  const renderTable = () => {
    if (formValues.isRepeatEnabled)
      return (
        <>
          <Table>
            <thead>
              <tr>
                <th>{__('Rule type')}</th>
                <th>{__('Type value')}</th>
                <th>{__('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(formValues.repeatRules || []).map((item: any, index: number) =>
                renderRow(item, index)
              )}
            </tbody>
          </Table>
          <div style={{ display: 'block', textAlign: 'right' }}>
            <Button
              btnStyle="success"
              icon="plus"
              size="small"
              onClick={handleAdd}
            >
              {__('Add row')}
            </Button>
          </div>
        </>
      );

    return;
  };

  return (
    <FlexItem>
      <LeftItem>
        {renderToggle()}
        {renderTable()}
      </LeftItem>
    </FlexItem>
  );
}
