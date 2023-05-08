import React from 'react';
import CourseItemComponent from '../../components/course/CourseItem';

type Props = {
  history: any;
  queryParams: any;
};
export default function CourseList(props) {
  const { history, queryParams } = props;

  return <CourseItemComponent {...props} />;
}
