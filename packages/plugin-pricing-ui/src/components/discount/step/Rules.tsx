import React from 'react';
// erxes
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import Toggle from '@erxes/ui/src/components/Toggle';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  formValues: any;
  handleState: (key: string, value: any) => void;
};

const Rules = (props: Props) => {
  const { formValues, handleState } = props;

  // Functions
  const renderQuantityRuleForm = () => (
    <>
      <FormLabel>{__('Quantity Rule')}</FormLabel>
      <FormGroup>
        <FormControl
          name="quantityType"
          componentClass="select"
          options={[
            {
              label: 'No minimum quantity required',
              value: null
            },
            {
              label: 'Require exact quantity',
              value: 'exact'
            },
            {
              label: 'Require minimum quantity',
              value: 'minimum'
            }
          ]}
          onChange={(e: any) => handleState('quantityType', e.target.value)}
        />
      </FormGroup>
      {formValues.quantityType && (
        <FormGroup>
          <FormControl
            componentClass="number"
            name="quantityValue"
            defaultValue={formValues.quantityValue || null}
            placeholder="Quantity"
            onChange={(e: any) =>
              handleState('quantityValue', parseFloat(e.target.value))
            }
          />
        </FormGroup>
      )}
    </>
  );

  const renderMinimumPurchaseForm = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Minimum purchase amount')}</FormLabel>
        <FormControl
          name="minPurchaseEnabled"
          componentClass="checkbox"
          onChange={(e: any) =>
            handleState('minPurchaseEnabled', e.target.checked)
          }
        />
        <br />
        {formValues.minPurchaseEnabled === true && (
          <FormControl
            componentClass="number"
            name="minPurchaseValue"
            defaultValue={formValues.minPurchaseValue || null}
            placeholder="0.00"
            onChange={(e: any) =>
              handleState('minPurchaseValue', parseFloat(e.target.value))
            }
          />
        )}
      </FormGroup>
    </>
  );

  return (
    <FlexItem>
      <LeftItem>
        {renderQuantityRuleForm()}
        {renderMinimumPurchaseForm()}
      </LeftItem>
    </FlexItem>
  );
};

export default Rules;
