import { Button, FormControl, Uploader } from '@erxes/ui/src';
import CommonForm from '@erxes/ui/src/components/form/Form';
import { FormColumn, FormWrapper, ModalFooter } from '@erxes/ui/src/styles/main';
import { IAttachment, IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { extractAttachment } from '@erxes/ui/src/utils/core';
import React from 'react';
import { ASSET_GROUP_STATUSES } from '../../../common/constant';
import { IAssetGroup, IAssetGroupTypes } from '../../../common/types';
import { CommonFormGroup, generateGroupOptions } from '../../../common/utils';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  group: IAssetGroupTypes;
  groups: IAssetGroupTypes[];
};

class Form extends React.Component<Props> {
  constructor(props) {
    super(props);

    const group = props.group || ({} as IAssetGroup);
    const attachment = group.attachment || undefined;
    this.state = {
      attachment
    };

    this.renderForm = this.renderForm.bind(this);
  }

  generateDocs(values) {
    const { group } = this.props;

    const finalValues = values;

    if (group) {
      finalValues._id = group._id;
    }

    return { ...finalValues };
  }

  onChangeAttachment = (files: IAttachment[]) => {
    this.setState({ attachment: files ? files[0] : undefined });
  };
  renderForm(formProps: IFormProps) {
    const { renderButton, closeModal, group, groups } = this.props;
    const { isSubmitted, values } = formProps;

    const object = group || ({} as IAssetGroup);

    const attachments = (object.attachment && extractAttachment([object.attachment])) || [];

    return (
      <>
        <CommonFormGroup label="Name">
          <FormControl name="name" {...formProps} type="text" defaultValue={object.name} />
        </CommonFormGroup>
        <CommonFormGroup label="Code">
          <FormControl name="code" {...formProps} type="text" defaultValue={object.code} />
        </CommonFormGroup>
        <CommonFormGroup label="Description">
          <FormControl
            name="description"
            {...formProps}
            componentClass="textarea"
            defaultValue={object.description}
          />
        </CommonFormGroup>

        <FormWrapper>
          <FormColumn>
            <CommonFormGroup label="Status">
              <FormControl
                name="status"
                {...formProps}
                componentClass="select"
                options={ASSET_GROUP_STATUSES}
                defaultValue={object.status}
              />
            </CommonFormGroup>
          </FormColumn>
          <FormColumn>
            <CommonFormGroup label="Image">
              <Uploader
                onChange={this.onChangeAttachment}
                defaultFileList={attachments}
                multiple={false}
                single={false}
              />
            </CommonFormGroup>
          </FormColumn>
        </FormWrapper>

        <CommonFormGroup label="Parent Group">
          <FormControl
            name="parentId"
            {...formProps}
            componentClass="select"
            defaultValue={object.parentId}
          >
            <option value="" />
            {generateGroupOptions(groups, object._id)}
          </FormControl>
        </CommonFormGroup>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal}>
            Cancel
          </Button>

          {renderButton({
            text: 'Asset Group',
            values: this.generateDocs(values),
            isSubmitted,
            callback: closeModal,
            object: group
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
