import React, { useState } from 'react';
import Select from 'react-select-plus';
import { FormControl, FormGroup } from '@erxes/ui/src/components/form';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import Form from '@erxes/ui/src/components/form/Form';
import Button from '@erxes/ui/src/components/Button';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter, Wrapper } from '@erxes/ui/src/styles/main';
// import { generateTree } from '../../utils';
import { IDepartment, IUnit } from '@erxes/ui/src/team/types';
import { generateTree, __ } from '@erxes/ui/src/utils';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  chapter?: any;
  closeModal: () => void;
  // departments: IDepartment[];
};

export default function ChapterForm(props: Props) {
  const { renderButton, closeModal } = props;
  const object = props.chapter || ({} as any);

  const [userIds, setUserIds] = useState(
    (object.users || []).map(user => user._id)
  );

  const generateDoc = values => {
    const finalValues = {} as any;
    finalValues.doc = { ...values, courseId: '1231' };
    // finalValues.doc.
    if (object) {
      finalValues.id = object._id;
    }

    return {
      ...finalValues
    };
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <Wrapper>
        <FormGroup>
          <ControlLabel required={true}>{__('Name')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            autoFocus={true}
            required={true}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            icon="times-circle"
            onClick={closeModal}
          >
            Cancel
          </Button>

          {renderButton({
            name: values.name,
            values: generateDoc(values),
            isSubmitted,
            callback: () => {},
            object
          })}
        </ModalFooter>
      </Wrapper>
    );
  };

  return <Form renderContent={renderContent} />;
}
