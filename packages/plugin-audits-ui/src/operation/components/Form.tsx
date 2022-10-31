import { Button, ControlLabel, Form as CommonForm, FormControl, FormGroup } from '@erxes/ui/src';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps, IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { SelectWithOperationCategory } from '../common/utils';

type Props = {
  queryParams: IQueryParams;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
} & IRouterProps;

type State = {
  parentId?: string | string[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderContent = this.renderContent.bind(this);
  }

  generateDoc(values) {
    return { doc: { ...values, ...this.state } };
  }

  renderContent(formProps: IFormProps) {
    const { isSubmitted, values } = formProps;
    const { renderButton, closeModal } = this.props;

    return (
      <>
        <FormGroup>
          <ControlLabel required>Name</ControlLabel>
          <FormControl {...formProps} required name="name" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel required>Description</ControlLabel>
          <FormControl {...formProps} required name="description" componentClass="textarea" />
        </FormGroup>
        <FormGroup>
          <ControlLabel required>Code</ControlLabel>
          <FormControl {...formProps} required name="code" type="text" />
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
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
