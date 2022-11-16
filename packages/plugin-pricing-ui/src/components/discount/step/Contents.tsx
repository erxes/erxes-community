import React from 'react';
import Datetime from '@nateradebaugh/react-datetime';
// erxes
import Table from '@erxes/ui/src/components/table';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import SelectProducts from '@erxes/ui-products/src/containers/SelectProducts';
import SelectProductCategory from '@erxes/ui-products/src/containers/SelectProductCategory';
import { DateContainer } from '@erxes/ui/src/styles/main';
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
        <FormLabel>{__('Status')}</FormLabel>
        <FormControl
          name="status"
          componentClass="select"
          options={[
            {
              label: 'Active',
              value: 'active'
            },
            {
              label: 'Archived',
              value: 'archived'
            },
            {
              label: 'Completed',
              value: 'completed'
            },
            {
              label: 'Disabled',
              value: 'disabled'
            }
          ]}
          onChange={(e: any) => handleState('status', e.target.value)}
          defaultValue={formValues.status}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>{__('Amount Type')}</FormLabel>
        <FormControl
          componentClass="radio"
          name="amountType"
          onChange={() => handleState('amountType', 'fixed')}
          defaultChecked={formValues.amountType === 'fixed'}
        >
          Fixed
        </FormControl>
        <FormControl
          componentClass="radio"
          name="amountType"
          onChange={() => handleState('amountType', 'percentage')}
          defaultChecked={formValues.amountType === 'percentage'}
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
          name="applyType"
          onChange={() => handleState('applyType', 'category')}
          defaultChecked={formValues.applyType === 'category'}
        >
          Specific Category
        </FormControl>
        <FormControl
          componentClass="radio"
          name="applyType"
          onChange={() => handleState('applyType', 'product')}
          defaultChecked={formValues.applyType === 'product'}
        >
          Specific Product
        </FormControl>
      </FormGroup>

      {formValues.applyType === 'category' ? (
        <>
          <FormGroup>
            <FormLabel>{__('Product categories')}</FormLabel>
            <SelectProductCategory
              name="categories"
              label="Choose categories"
              initialValue={formValues.categories}
              onSelect={categories => handleState('categories', categories)}
              multi={true}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>{__('Exclude categories')}</FormLabel>
            <SelectProductCategory
              name="categoriesExcluded"
              label="Choose categories to exclude"
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
              label="Choose products to exclude"
              initialValue={formValues.productsExcluded}
              onSelect={products => handleState('productsExcluded', products)}
              multi={true}
            />
          </FormGroup>
        </>
      ) : (
        <FormGroup>
          <FormLabel>{__('Products')}</FormLabel>
          <SelectProducts
            name="products"
            label="Choose products"
            initialValue={formValues.products}
            onSelect={products => handleState('products', products)}
            multi={true}
          />
        </FormGroup>
      )}
    </>
  );

  const renderDateRanger = () => {
    return (
      <Table bordered responsive>
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
        {renderBaseForm()}
        {renderProductForm()}
        {renderDateRanger()}
      </LeftItem>
    </FlexItem>
  );
};

export default ContentStep;
