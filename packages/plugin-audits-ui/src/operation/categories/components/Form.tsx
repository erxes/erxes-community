import { Button, ControlLabel, Form as CommonForm, FormControl, FormGroup } from '@erxes/ui/src';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps, IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { IOperationCategories } from '../../common/types';
import { SelectWithOperationCategory } from '../../common/utils';

type Props = {
  queryParams: IQueryParams;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  category?: IOperationCategories;
} & IRouterProps;

type State = {
  parentId?: string | string[];
  name?: string;
  code?: string;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderForm = this.renderForm.bind(this);
  }

  generateDoc(values) {
    return { doc: { ...values, ...this.state } };
  }

  renderForm(formProps: IFormProps) {
    const { renderButton, closeModal, category } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel required>Name</ControlLabel>
          <FormControl {...formProps} required type="text" name="name" value={category?.name} />
        </FormGroup>
        <FormGroup>
          <ControlLabel required>Code</ControlLabel>
          <FormControl {...formProps} required type="text" name="code" value={category?.code} />
        </FormGroup>
        <SelectWithOperationCategory
          label="Choose Parent Category"
          name="parentId"
          onSelect={value => this.setState({ parentId: value })}
          multi={false}
          initialValue={category?.parentId}
        />
        <ModalFooter>
          <Button btnStyle="simple" onClick={() => closeModal()}>
            Cancel
          </Button>
          {renderButton({
            text: 'Operation',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  }

  render() {
    return <CommonForm renderContent={this.renderForm} />;
  }
}

export default Form;
