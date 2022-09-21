import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils/core';
import {
  DateContainer,
  FormColumn,
  FormWrapper
} from '@erxes/ui/src/styles/main';
import { Form } from '@erxes/ui/src/components/form';
import CollapseContent from '@erxes/ui/src/components/CollapseContent';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';
import { IAssetCategory, IAssets } from '../types';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { generateCategoryOptions } from '@erxes/ui/src/utils';

type Props = {
  assets?: IAssets;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  assetCategories: IAssetCategory[];
};

type State = {
  name: string;
  code: string;
  unitPrice: number;
  createdUser: string;
  categoryId: string;
  moreValues: any;
};

class AssetsForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const assets = props.assets || ({} as IAssets);

    this.state = {
      name: assets.name || '',
      code: assets.code || '',
      unitPrice: assets.unitPrice || 0,
      createdUser: assets.createdUser || '',
      categoryId: assets.categoryId || '',

      moreValues: { ...assets }
    };
  }

  generateDoc = (values: { _id: string } & IAssets) => {
    const { assets } = this.props;

    const finalValues = values;

    if (assets) {
      finalValues._id = assets._id;
    }

    return {
      _id: finalValues._id,
      ...this.state,
      ...this.state.moreValues,
      name: finalValues.name,
      code: finalValues.code,
      unitPrice: Number(finalValues.unitPrice),
      createdUser: finalValues.createdUser
    };
  };

  onDateChange = (field, date) => {
    this.setState({
      moreValues: { ...this.state.moreValues, [field]: date }
    } as any);
  };

  renderDate = (name, formProps) => {
    return (
      <DateContainer>
        <DateControl
          {...formProps}
          name={name}
          value={this.state.moreValues[name]}
          onChange={this.onDateChange.bind(this, name)}
        />
      </DateContainer>
    );
  };

  onChange = e => {
    this.setState({ categoryId: e.target.value });
  };

  renderContent = (formProps: IFormProps) => {
    const { assets, renderButton, closeModal, assetCategories } = this.props;
    const { values, isSubmitted } = formProps;

    const object = assets || ({} as IAssets);

    return (
      <CollapseContent
        title={__('Ерөнхий мэдээлэл')}
        compact={true}
        open={true}
      >
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl
                {...formProps}
                name="name"
                autoFocus={true}
                required={true}
                defaultValue={object.name}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Code</ControlLabel>
              <FormControl
                {...formProps}
                name="code"
                defaultValue={object.code}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>UnitPrice</ControlLabel>
              <FormControl
                type="number"
                {...formProps}
                name="unitPrice"
                defaultValue={object.unitPrice}
              />
            </FormGroup>
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <ControlLabel>Created User</ControlLabel>
              <FormControl
                {...formProps}
                name="createdUser"
                defaultValue={object.createdUser}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Used At</ControlLabel>
              {this.renderDate('usedAt', formProps)}
            </FormGroup>

            <FormGroup>
              <ControlLabel>Category ID</ControlLabel>
              <FormControl
                {...formProps}
                name="cateforyId"
                defaultValue={object.categoryId}
                componentClass="select"
                onChange={this.onChange}
              >
                <option value="" />
                {generateCategoryOptions(assetCategories, object._id, true)}
              </FormControl>
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Close
          </Button>

          {renderButton({
            name: 'assets',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.assets
          })}
        </ModalFooter>
      </CollapseContent>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default AssetsForm;
