import { IProductCategory } from '@erxes/ui-products/src/types';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import React from 'react';

type Props = {
  productCategories?: IProductCategory[];
  defaultValue?: string;
  onChange: (value: string) => void;
};

class SelectCatgory extends React.Component<Props> {
  render() {
    const { productCategories = [], defaultValue } = this.props;

    const onCategoryChange = e => {
      this.props.onChange((e.currentTarget as HTMLInputElement).value);
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Categories:</ControlLabel>
          <FormControl
            id="productCategories"
            componentClass="select"
            defaultValue={defaultValue || ''}
            onChange={onCategoryChange}
          >
            <option>-</option>
            {productCategories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
      </>
    );
  }
}

export default SelectCatgory;
