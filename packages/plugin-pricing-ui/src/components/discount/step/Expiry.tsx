import React from 'react';
// erxes
import Button from '@erxes/ui/src/components/Button';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import Toggle from '@erxes/ui/src/components/Toggle';
import Tip from '@erxes/ui/src/components/Tip';
import { __ } from '@erxes/ui/src/utils';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
// local
import { Table } from '../../../styles';
import { DATE_OPTIONS } from '../../../constants';
import { DiscountData } from '../../../types';

type Props = {
  formValues: DiscountData;
  handleState: (key: string, value: any) => void;
};

export default function Expiry(props: Props) {
  const { formValues, handleState } = props;

  // Functions
  const handleChange = (index: number, key: string, value: any) => {
    const temp = [...formValues.expiryRules];
    temp[index][key] = value;

    handleState('expiryRules', temp);
  };

  const handleAdd = () => {
    const temp = [...formValues.expiryRules];
    temp.push({ type: 'day' });
    handleState('expiryRules', temp);
  };

  const handleDelete = (index: number) => {
    const temp = [...formValues.expiryRules];
    if (temp.length >= 1) temp.splice(index, 1);
    handleState('expiryRules', temp);
  };

  const renderRow = (item: any, index: number) => (
    <tr>
      <td>
        <FormGroup>
          <FormControl
            name="type"
            componentClass="select"
            placeholder={__('Select Type')}
            options={DATE_OPTIONS}
            onChange={(e: any) => handleChange(index, 'type', e.target.value)}
            value={item.type || 'day'}
          />
        </FormGroup>
      </td>
      <td>
        <FormGroup>
          <FormControl
            type="text"
            name="value"
            placeholder={__('e.g. 20')}
            onChange={(e: any) =>
              handleChange(index, 'typeValue', e.target.value)
            }
            value={item.typeValue || ''}
          />
        </FormGroup>
      </td>
      <td>
        <FormGroup>
          <FormControl
            type="text"
            name="value"
            placeholder={__('e.g. 10%')}
            onChange={(e: any) =>
              handleChange(index, 'discountValue', e.target.value)
            }
            value={item.discountValue || ''}
          />
        </FormGroup>
      </td>
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
      <FormLabel>{__('Set product expiry')}</FormLabel>
      <Toggle
        checked={formValues.isExpiryEnabled}
        onChange={(e: any) => handleState('isExpiryEnabled', e.target.checked)}
      />
    </FormGroup>
  );

  const renderTable = () => {
    if (formValues.isExpiryEnabled)
      return (
        <>
          <Table>
            <thead>
              <tr>
                <th>{__('Rule type')}</th>
                <th>{__('Type value')}</th>
                <th>{__('Discount value')}</th>
                <th>{__('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(formValues.expiryRules || []).map((item: any, index: number) =>
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
