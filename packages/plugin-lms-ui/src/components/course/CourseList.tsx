import React from 'react';
import { BoxContainer, PipelineMeta, ProjectItem } from './styles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Icon from '@erxes/ui/src/components/Icon';
export default function CourseList(props: any) {
  const renderDate = date => {
    if (!date) {
      return null;
    }

    return (
      <div>
        <Icon icon="clock-eight" />
        {dayjs(date).format('ll')}
      </div>
    );
  };
  console.log(props, 's');
  return props?.courses?.lmsCourses.map(course => (
    <Link to={`/lms/course?id=${course._id}`}>
      <ProjectItem>
        <h5>{course.name}</h5>
        <PipelineMeta>{renderDate(course.createdAt)}</PipelineMeta>
      </ProjectItem>
    </Link>
  ));
}
