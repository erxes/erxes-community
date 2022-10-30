import { IButtonMutateProps, IFormProps, IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { Button, ControlLabel, Form as CommonForm, FormControl, FormGroup } from '@erxes/ui/src';
import { SelectWithOperationCategory } from '../../common/utils';
import { ModalFooter } from '@erxes/ui/src/styles/main';

type Props = {
  queryParams: IQueryParams;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
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
    const { renderButton, closeModal } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel required>Name</ControlLabel>
          <FormControl {...formProps} required type="text" name="name" />
        </FormGroup>
        <FormGroup>
          <ControlLabel required>Code</ControlLabel>
          <FormControl {...formProps} required type="text" name="code" />
        </FormGroup>
        <SelectWithOperationCategory
          label="Choose Parent Category"
          name="parentId"
          onSelect={value => this.setState({ parentId: value })}
          multi={false}
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
