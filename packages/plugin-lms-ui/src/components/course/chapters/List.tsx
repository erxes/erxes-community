import React from 'react';
import {
  Box,
  ControlLabel,
  EmptyState,
  FormControl,
  Icon,
  ModalTrigger,
  Tip
} from '@erxes/ui/src/components';

import ItemContainer from '../../../containers/course/chapters/Item';
import Button from '@erxes/ui/src/components/Button';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import { Footer } from '@erxes/ui/src/styles/chooser';
import { __ } from '@erxes/ui/src/utils';
import ChapterFormContainer from '../../../containers/course/chapters/Form';
import queryString from 'query-string';
import { ActionButtons } from '@erxes/ui-settings/src/styles';
import { Wrapper } from '@erxes/ui/src/styles/main';
import { SideList } from '../../../styles';
import { ChooseLessonTypeForm } from '../Lessons/LessonForm';
import { ChooseLessonTypeFormContainer } from '../../../containers/course/lessons/LessonForm';
type Props = {
  chapters: any;
};

export default function List({ chapters }: Props) {
  const AllChapters = chapters.data.lmsChapters || [];

  const renderChooseLessonTypeForm = () => {
    const editTrigger = (
      <Button btnStyle="success" type="button">
        Add lesson
      </Button>
    );

    const content = () => {
      return <ChooseLessonTypeFormContainer />;
    };

    return (
      <ModalTrigger
        title="Deliver learning content"
        trigger={editTrigger}
        content={content}
        size="xl"
      />
    );
  };

  const renderItems = (chapter: any) => {
    if (!chapter) {
      return <EmptyState icon="ban" text="No chapters" size="small" />;
    }

    return (
      <div key={chapter._id}>
        <ItemContainer
          key={chapter._id}
          chapter={chapter}
          refetch={chapters.refetch}
        />
        <SideList key={chapter._id}>
          {renderChooseLessonTypeForm()}
          <Button btnStyle="simple" type="button" onClick={() => {}}>
            Copy lesson from
          </Button>
        </SideList>
      </div>
    );
  };

  const renderSidebarFooter = () => {
    const trigger = (
      <Button block icon="plus-circle">
        Add Chapter
      </Button>
    );

    // const content = (props) => (
    //   <KnowledgeForm {...props} renderButton={this.props.renderButton} />
    // );
    return (
      <Footer>
        <ModalTrigger
          title="Add chapter"
          autoOpenKey="showLmsAddChapterModal"
          trigger={trigger}
          content={() => {
            return <ChapterFormContainer closeModal={() => {}} />;
          }}
          enforceFocus={false}
        />
      </Footer>
    );
  };

  const renderEditForm = props => {
    console.log(props, 'edit passed data');
    return <ChapterFormContainer {...props} />;
  };

  const editTrigger = (
    <Button btnStyle="link">
      <Tip text={__('Edit')} placement="bottom">
        <Icon icon="edit" />
      </Tip>
    </Button>
  );

  // const content = () => {
  //   return renderEditForm({ chapter });
  // };

  // return <ModalTrigger title='Edit' trigger={editTrigger} content={content} />;
  const extraButtons = chapter => {
    <ModalTrigger
      content={({ closeModal }) => renderEditForm({ closeModal })}
      title={`edit chapter`}
      trigger={editTrigger}
    />;
    // return (
    //   <ActionButtons>
    //     {renderEditAction(chapter)}
    //     <Tip text={__('Delete')} placement='bottom'>
    //       <Button
    //         btnStyle='link'
    //         onClick={() => {
    //           console.log('deleted');
    //         }}
    //         icon='cancel-1'
    //       />
    //     </Tip>
    //   </ActionButtons>
    // );
  };
  const queryParams = queryString.parse(location.search);
  console.log(queryParams, 'hey');
  return (
    // <BlockList
    //   allDatas={AllChapters}
    //   renderForm={renderForm}
    //   renderItems={renderItems()}
    //   title={'chapter'}
    // />
    <>
      <Sidebar wide={true} footer={renderSidebarFooter()} hasBorder={true}>
        {AllChapters.map((chapter: any) => {
          // return <Box title={chapter.name} children={renderItems()}></Box>;
          return (
            <Box
              title={chapter.name}
              // isOpen={queryParams.id ? true : false}
              isOpen={true}
              extraButtons={extraButtons}
              name="showChapter"
            >
              {renderItems(chapter)}
            </Box>
          );
        })}
      </Sidebar>
    </>
  );
}
