import React from 'react';
// erxes
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import SelectProducts from '@erxes/ui-products/src/containers/SelectProducts';
import SelectProductCategory from '@erxes/ui-products/src/containers/SelectProductCategory';
import { FlexItem, LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  formValues: any;
  handleState: (key: string, value: any) => void;
};

const ContentStep = (props: Props) => {
  const { formValues, handleState } = props;

  return (
    <FlexItem>
      <LeftItem>
        <FormGroup>
          <FormLabel required={true}>{__('Name')}</FormLabel>
          <FormControl
            type="text"
            name="name"
            placeholder={__('Name')}
            defaultValue={formValues.name}
            required={true}
            onChange={(event: any) =>
              handleState((event.target as HTMLInputElement).value, 'name')
            }
          />
        </FormGroup>
        <FormGroup>
          <FormLabel required={true}>{__('Amount')}</FormLabel>
          <FormControl
            type="number"
            name="amount"
            placeholder={__('Amount')}
            defaultValue={formValues.amount}
            required={true}
            onChange={(event: any) =>
              handleState((event.target as HTMLInputElement).value, 'amount')
            }
          />
        </FormGroup>
        <FormGroup>
          <FormLabel required={true}>{__('Products')}</FormLabel>
          <SelectProducts
            name="products"
            label="Choose Products"
            initialValue={formValues.products}
            onSelect={products => handleState('products', products)}
            multi={true}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel required={true}>{__('Product categories')}</FormLabel>
          <SelectProductCategory
            name="productCategory"
            label="Choose Product Category"
            initialValue={formValues.productCategory}
            onSelect={productCategory =>
              handleState('productCategory', productCategory)
            }
            multi={true}
          />
        </FormGroup>
      </LeftItem>
    </FlexItem>
  );
};

export default ContentStep;
