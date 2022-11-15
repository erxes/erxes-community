import React, { useState } from 'react';
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

  // Hooks
  const [isCategoryRequired, setCategoryRequired] = useState<boolean>(false);
  const [isPercentage, setPercentage] = useState<boolean>(false);

  // Functions
  const renderBaseForm = () => (
    <>
      <FormGroup>
        <FormLabel required={true}>{__('Name')}</FormLabel>
        <FormControl
          type="text"
          name="name"
          placeholder={__('Name')}
          defaultValue={formValues.name}
          required={true}
          onChange={(event: any) =>
            handleState('name', (event.target as HTMLInputElement).value)
          }
        />
      </FormGroup>
      <FormGroup>
        <FormLabel required={true}>{__('Amount Type')}</FormLabel>
        <FormControl
          componentClass="radio"
          name="amountType"
          onChange={() => handleState('amountType', 'fixed')}
          defaultChecked
        >
          Fixed
        </FormControl>
        <FormControl
          componentClass="radio"
          name="amountType"
          onChange={() => handleState('amountType', 'percentage')}
        >
          Percentage
        </FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel required={true}>{__('Amount Value')}</FormLabel>
        <FormControl
          type="number"
          name="amountValue"
          placeholder={formValues.amountType === 'percentage' ? '0%' : '0.00'}
          defaultValue={formValues.amountValue}
          required={true}
          onChange={(event: any) =>
            handleState(
              'amountValue',
              parseFloat((event.target as HTMLInputElement).value)
            )
          }
        />
      </FormGroup>
    </>
  );

  const renderProductForm = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Applies to')}</FormLabel>
        <FormControl
          componentClass="radio"
          name="isCategory"
          onChange={() => setCategoryRequired(true)}
        >
          Specific Category
        </FormControl>
        <FormControl
          componentClass="radio"
          name="isCategory"
          onChange={() => setCategoryRequired(false)}
          defaultChecked
        >
          Specific Product
        </FormControl>
      </FormGroup>

      {isCategoryRequired ? (
        <>
          <FormGroup>
            <FormLabel required={true}>{__('Product categories')}</FormLabel>
            <SelectProductCategory
              name="productCategories"
              label="Choose Product Categories"
              initialValue={formValues.productCategories}
              onSelect={productCategory =>
                handleState('productCategories', productCategory)
              }
              multi={true}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>{__('Exclude products')}</FormLabel>
            <SelectProducts
              name="productsExcluded"
              label="Choose Product to exclude"
              initialValue={formValues.productsExcluded}
              onSelect={products => handleState('productsExcluded', products)}
              multi={true}
            />
          </FormGroup>
        </>
      ) : (
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
      )}
    </>
  );

  return (
    <FlexItem>
      <LeftItem>
        {renderBaseForm()}
        {renderProductForm()}
      </LeftItem>
    </FlexItem>
  );
};

export default ContentStep;
