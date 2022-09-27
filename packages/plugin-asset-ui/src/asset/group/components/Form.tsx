import { Button, FormControl, Uploader } from '@erxes/ui/src';
import CommonForm from '@erxes/ui/src/components/form/Form';
import { FormColumn, FormWrapper, ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { ASSET_CATEGORY_STATUSES } from '../../../common/constant';
import { CommonFormGroup } from '../../../common/utils';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

class Form extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.renderForm = this.renderForm.bind(this);
  }

  generateDocs(values) {
    return { ...values };
  }

  renderForm(formProps: IFormProps) {
    const { renderButton, closeModal } = this.props;
    const { isSubmitted, values } = formProps;
    // console.log(this.props);
    return (
      <>
        <CommonFormGroup label='Name'>
          <FormControl name='name' {...formProps} type='text' />
        </CommonFormGroup>
        <CommonFormGroup label='Code'>
          <FormControl name='code' {...formProps} type='text' />
        </CommonFormGroup>
        <CommonFormGroup label='Description'>
          <FormControl name='description' {...formProps} componentClass='textarea' />
        </CommonFormGroup>

        <FormWrapper>
          <FormColumn>
            <CommonFormGroup label='Status'>
              <FormControl
                name='status'
                {...formProps}
                componentClass='select'
                options={ASSET_CATEGORY_STATUSES}
              />
            </CommonFormGroup>
          </FormColumn>
          <FormColumn>
            <CommonFormGroup label='Image'>
              <Uploader onChange={e => console.log(e)} defaultFileList={[]} />
            </CommonFormGroup>
          </FormColumn>
        </FormWrapper>

        <CommonFormGroup label='Parent Category'>
          <FormControl
            name='parentId'
            {...formProps}
            componentClass='select'
            options={[]}
          />
        </CommonFormGroup>

        <ModalFooter>
          <Button btnStyle='simple' onClick={closeModal}>
            Cancel
          </Button>

          {renderButton({
            name: 'Asset category',
            values: this.generateDocs(values),
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
