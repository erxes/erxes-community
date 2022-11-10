import React, { useState } from 'react';
// erxes
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import FormLabel from '@erxes/ui/src/components/form/Label';
import Button from '@erxes/ui/src/components/Button';
import CommonForm from '@erxes/ui/src/components/form/Form';
import SelectProducts from '@erxes/ui-products/src/containers/SelectProducts';
import SelectProductCategory from '@erxes/ui-products/src/containers/SelectProductCategory';

import {
  FlexContent,
  FlexRightItem,
  FlexItem
} from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  closeModal?: () => void;
};

const Form = (props: Props) => {
  const { closeModal } = props;
  const [formValues, setFormValues] = useState<any>({
    name: '',
    products: [],
    productCategory: []
  });

  const handleState = (key: string, value: any) => {
    const tempState = { ...formValues };
    tempState[key] = value;

    setFormValues(tempState);
  };

  const renderContent = () => (
    <>
      <FlexContent>
        <FlexItem>
          <FormGroup>
            <FormLabel required={true}>{__('Name')}</FormLabel>
            <FormControl
              type="text"
              name="name"
              placeholder={__('Name')}
              value={formValues.name}
              required={true}
              onChange={(event: any) =>
                handleState((event.target as HTMLInputElement).value, 'name')
              }
            />
          </FormGroup>
          <FormGroup>
            <SelectProducts
              name="products"
              label="Choose Products"
              initialValue={formValues.products}
              onSelect={products => handleState('products', products)}
              multi={true}
            />
          </FormGroup>
          <FormGroup>
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
        </FlexItem>
      </FlexContent>
      <FlexContent>
        <FlexRightItem>
          <FormGroup>
            <Button
              btnStyle="simple"
              type="button"
              icon="times-circle"
              uppercase={false}
              onClick={() => closeModal && closeModal()}
            >
              {__('Cancel')}
            </Button>
            <Button
              btnStyle="success"
              type="button"
              icon="check-circle"
              uppercase={false}
            >
              {__('Save')}
            </Button>
          </FormGroup>
        </FlexRightItem>
      </FlexContent>
    </>
  );

  return <CommonForm renderContent={renderContent} />;
};

export default Form;
