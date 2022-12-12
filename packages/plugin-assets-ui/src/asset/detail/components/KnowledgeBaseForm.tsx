import React from 'react';
import {
  Alert,
  Button,
  ButtonMutate,
  CollapseContent,
  ControlLabel,
  Form as CommonForm,
  FormControl,
  FormGroup,
  Icon,
  Table,
  __,
  Label
} from '@erxes/ui/src';
import { IFormProps } from '@erxes/ui/src/types';
import { ContainerBox, MovementTableWrapper, RemoveRow } from '../../../style';
import { FormColumn, FormWrapper, ModalFooter } from '@erxes/ui/src/styles/main';
import { EditorWrapper } from '@erxes/ui-internalnotes/src/components/Form';
import EditorCK from '@erxes/ui/src/components/EditorCK';
import { mutations } from '../../graphql';
import { getRefetchQueries } from '../../../common/utils';
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';

type KnowledgeBaseContentType = {
  _id:string,
  title:string,
  isTitleEntered: boolean,
  content:string
}

type KnowledgeBaseDataType = {
  _id:string,
  name:string,
  description:string,
  contents:KnowledgeBaseContentType[]
}
type Props = {
  assetId: string;
  closeModal: () => void;
  knowledgeBaseData?: KnowledgeBaseDataType;
};

type State = {
  currentActiveItems: string[];
  knowledgeBaseData:KnowledgeBaseDataType
};

class KnowledgeBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentActiveItems: [],
      knowledgeBaseData:props. knowledgeBaseData||{}
    };
  }

  handleAdd = () => {
    this.setState(({ knowledgeBaseData }) => ({
      knowledgeBaseData:{...knowledgeBaseData,contents: [...(knowledgeBaseData?.contents || []), { _id: String(Math.random()), content: '', title: '', isTitleEntered: false }]}
    }));
  };

  renderEditor = (content, i) => {
    const { currentActiveItems, knowledgeBaseData } = this.state;
    console.log('dasd');
    const handleTitleField = e => {
      if (e.key === 'Enter') {
        const updatedContents = knowledgeBaseData?.contents.map(c =>
          c._id === content._id ? { ...c, isTitleEntered: true } : c
        );
        this.setState({ knowledgeBaseData:{...knowledgeBaseData,contents: updatedContents} });
      }
    };

    const handleChange = e => {
      const { value } = e.currentTarget as HTMLInputElement;

      const updatedContents = knowledgeBaseData?.contents.map(c =>
        c._id === content._id ? { ...c, title: value } : c
      );

      this.setState({ knowledgeBaseData:{...knowledgeBaseData,contents: updatedContents} });
    };

    const removeItem = () => {
      const removedActiveItemIds = currentActiveItems.filter(id => id !== content._id);
      const removeContents = knowledgeBaseData?.contents.filter(c => c._id !== content._id);

      this.setState({ knowledgeBaseData:{...knowledgeBaseData,contents: removeContents}, currentActiveItems: removedActiveItemIds });
    };

    const titleField = (
      <FormControl
        type="text"
        placeholder="type a title"
        name={content._id}
        value={content?.title}
        onKeyDown={handleTitleField}
        onChange={handleChange}
      />
    );

    const handleActve = () => {
      if (currentActiveItems.includes(content._id)) {
        return this.setState({
          currentActiveItems: currentActiveItems.filter(item => item !== content._id)
        });
      }
      this.setState({ currentActiveItems: [...currentActiveItems, content._id] });
    };

    const handleEditorChange = e => {
      const data = e.editor.getData();

      const updatedContents = knowledgeBaseData?.contents.map(c =>
        c._id === content._id ? { ...c, content: data } : c
      );
      this.setState({ knowledgeBaseData:{...knowledgeBaseData,contents: updatedContents} });
    };

    const handleChangeTitle = () => {
      this.setState({knowledgeBaseData:{...knowledgeBaseData,contents:knowledgeBaseData.contents.map(c=>c._id === content._id?{...c, isTitleEntered: false}:c)}})
    }

    return (
      <>
        <tr
          onClick={handleActve}
          className={currentActiveItems.includes(content._id) ? 'active' : ''}
        >
          <td>
            {content.isTitleEntered ? (
              <span style={{cursor:'pointer'}} onClick={handleChangeTitle}>{content.title}</span>
            ) : (
              <div style={{ width: 250 }}>{titleField}</div>
            )}
          </td>
          <td style={{ width: 50 }}>
            <RemoveRow onClick={removeItem}>
              <Icon icon="times-circle" />
            </RemoveRow>
          </td>
        </tr>
        {currentActiveItems.includes(content._id) && (
          <tr>
            <td colSpan={7}>
              <EditorWrapper>
                <EditorCK
                  onChange={handleEditorChange}
                  content={content.content}
                  toolbar={[
                    {
                      name: 'basicstyles',
                      items: [
                        'Bold',
                        'Italic',
                        'NumberedList',
                        'BulletedList',
                        'Link',
                        'Unlink',
                        '-',
                        'Image',
                        'EmojiPanel'
                      ]
                    }
                  ]}
                />
              </EditorWrapper>
            </td>
          </tr>
        )}
      </>
    );
  };

  generateDoc = () => {
    const { knowledgeBaseData } = this.state;

    const { assetId } = this.props;

    const updateContents = (knowledgeBaseData?.contents || []).map(({title,content,_id}) => ({
      title,content,_id
    }));

    return {
      assetId,
      knowledgeBaseData: {...knowledgeBaseData,contents:updateContents}
    };
  };

  removeKnowledgeBase = () => {
    const { assetId, knowledgeBaseData, closeModal } = this.props;
    knowledgeBaseData &&
      client
        .mutate({
          mutation: gql(mutations.removeKnowledgeBase),
          variables: { assetId, knowledgeBaseId: knowledgeBaseData._id },
          refetchQueries: getRefetchQueries()
        })
        .then(() => {
          Alert.success('You have removed the knowledge base from this asset');
          closeModal()
        });
  };

  renderContent = (formProps: IFormProps) => {
    const { knowledgeBaseData } = this.state;
    const { closeModal } = this.props;

    const handleChange = e => {
      const { value, name } = e.currentTarget as HTMLInputElement;
      this.setState({knowledgeBaseData:{...knowledgeBaseData,[name]:value}})
    };

    return (
      <>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" name="name" value={knowledgeBaseData?.name} onChange={handleChange} />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                type="text"
                name="description"
                value={knowledgeBaseData?.description}
                onChange={handleChange}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <MovementTableWrapper>
          <Table>
            <tbody>{(knowledgeBaseData?.contents || []).map((content, i) => this.renderEditor(content, i))}</tbody>
          </Table>
        </MovementTableWrapper>

        <ContainerBox justifyCenter>
          <Button icon="plus-1" onClick={this.handleAdd}>
            {__('Add')}
          </Button>
        </ContainerBox>
        <ModalFooter>
          <Button btnStyle="simple">Cancel</Button>
          {this.props.knowledgeBaseData && (
            <Button btnStyle="danger" icon="minus-1" onClick={this.removeKnowledgeBase}>
              Delete
            </Button>
          )}
          <ButtonMutate
            mutation={
              this.props.knowledgeBaseData ? mutations.updateKnowledgeBase : mutations.addKnowledgeBase
            }
            variables={this.generateDoc()}
            type="submit"
            uppercase={false}
            refetchQueries={getRefetchQueries()}
            isSubmitted={formProps.isSubmitted}
            successMessage={'You successfully added knowledgebase in this asset'}
            callback={closeModal}
          />
        </ModalFooter>
      </>
    );
  };

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default KnowledgeBase;
