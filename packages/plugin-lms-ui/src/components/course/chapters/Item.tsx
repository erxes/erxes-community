import React from 'react';

import { IUnit } from '@erxes/ui/src/team/types';
import BlockItem from './BlockItem';
import FormContainer from '../../../containers/course/chapters/Form';
import { EmptyState } from '@erxes/ui/src/components';
import LessonForm from '../../../containers/course/lessons/LessonForm';

type Props = {
  deleteLesson: (_id: string, callback: () => void) => void;
  refetch: () => void;
  lessons: any;
};

export default function Item(props: Props) {
  const { lessons, refetch, deleteLesson } = props;
  const AllLessons = lessons.data.lmsLessons || [];
  const renderForm = (lesson: any) => {
    return (
      <LessonForm
        {...props}
        lessson={lesson}
        queryParams={{}}
        currentCategoryId={''}
        topicId={''}
      />
    );
    // return <LessonForm chapter={lessons} />;
  };
  const renderItems = () => {
    return (
      AllLessons.length > 0 &&
      AllLessons.map(lesson => (
        <BlockItem
          item={lesson}
          title={lesson.title}
          renderForm={renderForm}
          deleteItem={deleteLesson}
          refetch={refetch}
          queryParamName="LessonId"
        />
      ))
    );
  };

  return renderItems();
}
