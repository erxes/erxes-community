import React from 'react';
// erxes
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import Tip from '@erxes/ui/src/components/Tip';
import Toggle from '@erxes/ui/src/components/Toggle';
import { __ } from '@erxes/ui/src/utils';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
// local
import { Table } from '../../../styles';
import { DiscountData } from '../../../types';

type Props = {
  formValues: DiscountData;
  handleState: (key: string, value: any) => void;
};

export default function Price(props: Props) {
  const { formValues, handleState } = props;

  // Functions
  const handleChange = (index: number, key: string, value: any) => {
    const temp = [...formValues.priceRules];
    temp[index][key] = value;

    handleState('priceRules', [...temp]);
  };

  const handleAdd = () => {
    const temp = [...formValues.priceRules];
    temp.push({ type: 'exact' });
    handleState('priceRules', [...temp]);
  };

  const handleDelete = (index: number) => {
    const temp = [...formValues.priceRules];
    if (temp.length > 1) temp.splice(index, 1);
    handleState('priceRules', [...temp]);
  };

  const renderRow = (item: any, index: number) => {
    return (
      <tr key={index}>
        <td>
          <FormGroup>
            <FormControl
              name="type"
              componentClass="select"
              options={[
                {
                  label: 'Exact',
                  value: 'exact'
                },
                {
                  label: 'Minimum',
                  value: 'minimum'
                },
                {
                  label: 'Every',
                  value: 'every'
                }
              ]}
              onChange={(e: any) => handleChange(index, 'type', e.target.value)}
              value={item.type || 'exact'}
            />
          </FormGroup>
        </td>
        <td>
          <FormGroup>
            <FormControl
              componentClass="number"
              name="value"
              placeholder={__('0.00$')}
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
              componentClass="number"
              name="value"
              placeholder={__('e.g. 20% (leave empty for default)')}
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
  };

  const renderTable = () => {
    if (formValues.isPriceEnabled)
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
              {(formValues.priceRules || []).map((item: any, index: number) =>
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
        <FormGroup>
          <FormLabel>{__('Enable price rule')}</FormLabel>
          <Toggle
            defaultChecked={formValues.isPriceEnabled}
            onChange={(event: any) =>
              handleState('isPriceEnabled', event.target.checked)
            }
          />
        </FormGroup>
        {renderTable()}
      </LeftItem>
    </FlexItem>
  );
}
