import Button from '@erxes/ui/src/components/Button';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import EditorCK from '@erxes/ui/src/components/EditorCK';
import { __ } from 'coreui/utils';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';

type Props = {
  save: (args: { _id?: String; doc }) => void;
};

type State = {
  name?: string;
  content?: string;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { name: '', content: '' };
  }

  onContentChange = e => {
    this.setState({ content: e.editor.getData() });
  };

  onChangeField = (key, e) => {
    this.setState({ [key]: e.currentTarget.value });
  };

  onSave = () => {
    const { name, content } = this.state;

    this.props.save({
      doc: {
        name,
        content
      }
    });
  };

  render() {
    const content = (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            name="name"
            required={true}
            autoFocus={true}
            onChange={this.onChangeField.bind(this, 'name')}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Content</ControlLabel>

          <EditorCK
            content={''}
            onChange={this.onContentChange}
            height={200}
            name="document-form"
          />
        </FormGroup>

        <Button
          onClick={this.onSave}
          btnStyle="success"
          type="button"
          icon="times-circle"
        >
          Save
        </Button>
      </>
    );

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Documents'), link: '/documents' }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Documents')} breadcrumb={breadcrumb} />
        }
        content={content}
        transparent={true}
        hasBorder
      />
    );
  }
}

export default Form;
