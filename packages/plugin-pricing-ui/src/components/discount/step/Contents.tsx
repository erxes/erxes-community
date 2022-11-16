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

  // Functions
  const renderBaseForm = () => (
    <>
      <FormGroup>
        <FormLabel required={true}>{__('Name')}</FormLabel>
        <FormControl
          type="text"
          name="name"
          placeholder={__('Name')}
          value={formValues.name}
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

  console.log(formValues.appliesToCategory);

  const renderProductForm = () => (
    <>
      <FormGroup>
        <FormLabel>{__('Applies to')}</FormLabel>
        <FormControl
          componentClass="radio"
          name="appliesToCategory"
          onChange={() => handleState('appliesToCategory', true)}
          defaultChecked={formValues.appliesToCategory === true}
        >
          Specific Category
        </FormControl>
        <FormControl
          componentClass="radio"
          name="appliesToCategory"
          onChange={() => handleState('appliesToCategory', false)}
          defaultChecked={formValues.appliesToCategory === false}
        >
          Specific Product
        </FormControl>
      </FormGroup>

      {formValues.appliesToCategory ? (
        <>
          <FormGroup>
            <FormLabel required={true}>{__('Product categories')}</FormLabel>
            <SelectProductCategory
              name="categories"
              label="Choose Product Categories"
              initialValue={formValues.categories}
              onSelect={categories => handleState('categories', categories)}
              multi={true}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel required={true}>{__('Exclude categories')}</FormLabel>
            <SelectProductCategory
              name="categoriesExcluded"
              label="Choose Product Categories"
              initialValue={formValues.categoriesExcluded}
              onSelect={categories =>
                handleState('categoriesExcluded', categories)
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
