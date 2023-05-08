import { IArticle, ITopic } from '@erxes/ui-knowledgeBase/src/types';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';

import ControlLabel from '@erxes/ui/src/components/form/Label';
import EditorCK from '@erxes/ui/src/components/EditorCK';
import { FILE_MIME_TYPES } from '@erxes/ui-settings/src/general/constants';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ModalFooter, Wrapper } from '@erxes/ui/src/styles/main';
import React from 'react';
import { extractAttachment, __ } from '@erxes/ui/src/utils';
import { FlexContent, FlexItem } from '@erxes/ui/src/layout/styles';
import styled from 'styled-components';
import LessonFormContainer from '../../../containers/course/lessons/LessonForm';
import { Link } from 'react-router-dom';

type Props = {
  lesson: IArticle;
  currentCategoryId: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  topics?: ITopic[];
  lessonDetail: any;
};

type State = {
  content: string;
  // reactionChoices: string[];
  // topicId?: string;
  // categoryId: string;
  // attachments: IAttachment[];
  // image: IAttachment | null;
  // erxesForms: IErxesForm[];
};

class LessonForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const detail = props.lessonDetail || ({ content: '' } as IArticle);
    const attachments =
      (detail.attachments && extractAttachment(detail.attachments)) || [];
    const image = detail.image ? extractAttachment([detail.image])[0] : null;

    this.state = {
      content: detail.content
      // reactionChoices: detail.reactionChoices || [],
      //   categoryId: article.topicId,
      // categoryId: detail.categoryId,
      // erxesForms: detail.forms || [],
      // image,
      // attachments
    };

    console.log(props.lessonDetail, 'detail');
  }

  componentDidUpdate(prevProps) {
    const { topics, currentCategoryId, lessonDetail } = this.props;

    // if (!this.state.categoryId && categories && categories.length > 0) {
    //   this.setState({
    //     categoryId: categories[0]._id
    //     // categoryId: currentCategoryId
    //   });
    // }
  }

  // getFirstAttachment = () => {
  //   const { attachments } = this.state;

  //   return attachments.length > 0 ? attachments[0] : ({} as IAttachment);
  // };

  generateDoc = (values: {
    _id?: string;
    title: string;
    summary: string;
    status: string;
  }) => {
    const { lessonDetail, currentCategoryId } = this.props;
    const {
      // attachments,
      content
      // reactionChoices,
      // topicId,
      // categoryId,
      // image,
      // erxesForms
    } = this.state;

    const finalValues = values;

    if (lessonDetail) {
      finalValues._id = lessonDetail._id;
    }

    return {
      id: finalValues._id,
      doc: {
        title: finalValues.title,
        summary: finalValues.summary,
        content,
        status: finalValues.status,
        courseId: '1231',
        chapterId: 'XkS2RFoo4MXQsJxjt'
      }
    };
  };

  onChange = e => {
    this.setState({ content: e.editor.getData() });
  };

  generateOptions = options => {
    return options.map(option => ({
      value: option._id,
      label: option.title
    }));
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal, lessonDetail } = this.props;
    console.log(this.props.closeModal, 'props');
    const { content } = this.state;

    const mimeTypeOptions = FILE_MIME_TYPES.map(item => ({
      value: item.value,
      label: `${item.label} (${item.extension})`
    }));

    const { isSubmitted, values } = formProps;

    const object = lessonDetail || ({} as any);

    return (
      <Wrapper>
        <FormGroup>
          <ControlLabel required={true}>{__('Title')}</ControlLabel>
          <FormControl
            {...formProps}
            name="title"
            defaultValue={object.title}
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        {/* <FormGroup>
          <ControlLabel>{__('Summary')}</ControlLabel>
          <FormControl
            {...formProps}
            name='summary'
            defaultValue={object.summary}
          />
        </FormGroup> */}

        <FormGroup>
          <ControlLabel required={true}>{__('Status')}</ControlLabel>
          <FormControl
            {...formProps}
            name="status"
            componentClass="select"
            placeholder={__('Select')}
            defaultValue={object.status || 'draft'}
            required={true}
          >
            {[{ value: 'draft' }, { value: 'publish' }].map(op => (
              <option key={op.value} value={op.value}>
                {op.value}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>{__('Content')}</ControlLabel>
          <EditorCK
            content={content}
            onChange={this.onChange}
            isSubmitted={isSubmitted}
            height={300}
            name={`lms_${lessonDetail ? lessonDetail._id : 'create'}`}
          />
        </FormGroup>

        <ModalFooter>
          {renderButton({
            passedName: 'lesson',
            values: this.generateDoc(values),
            isSubmitted,
            callback: () => {
              console.log('closed');
            },
            object: object
          })}
        </ModalFooter>
      </Wrapper>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default LessonForm;

const ListWrapper = styled(Wrapper)`
  .FlexItem div:hover {
    background-color: yellow;
    font-weight: bold;
  }
`;
type LessonFormProps = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};
export function ChooseLessonTypeForm(props: any) {
  const generateDoc = (values: {
    _id?: string;
    title: string;
    summary: string;
    status: string;
  }) => {
    const {
      // attachments,
      content
      // reactionChoices,
      // topicId,
      // categoryId,
      // image,
      // erxesForms
    } = this.state;

    const finalValues = values;

    return {
      id: finalValues._id,
      doc: {
        title: finalValues.title
      }
    };
  };

  const formOnClick = type => {
    console.log(type, 'type:');
    return <LessonFormContainer />;
  };

  const renderContent = (formProps: IFormProps) => {
    const { isSubmitted, values } = formProps;
    return (
      <Wrapper>
        <FlexContent>
          <FlexItem count={3}>
            <Link to={'/lms/course?type=video'}>
              <span>VIDEO</span>
              <p>Easily upload and display your video content in Erxes</p>
            </Link>
          </FlexItem>
          <FlexItem count={3} hasSpace={true}>
            <FormGroup>
              <Link to={'/lms/course?type=text'}>
                <span>TEXT</span>
                <p>
                  Include bodies of text, styled HTML content, and also images
                  or external links
                </p>
              </Link>
            </FormGroup>
          </FlexItem>
        </FlexContent>
        <FlexContent>
          <FlexItem count={3}>
            <Link to={'/lms/course?type=pdf'}>
              <span>PDF</span>
              <p>
                Easily upload PDF content for your students to view directly
                within the Course Player
              </p>
            </Link>
          </FlexItem>
        </FlexContent>
      </Wrapper>
    );
  };
  return <Form renderContent={renderContent} />;
}
