import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { Title } from '@erxes/ui/src/styles/main';
import CategoryList from '../containers/category/CategoryList';
import CourseListConteiner from '../containers/course/CourseList';

type Props = {
  history: any;
};
export default function LmsComponent(props: Props) {
  const leftActionBar = <Title>Courses</Title>;
  console.log(props, 'hey');
  const actionBarLeft = (
    <Button
      btnStyle="primary"
      icon="plus-circle"
      onClick={() => {
        props.history.push(`/lms/course`);
      }}
    >
      Create new course
    </Button>
  );
  return (
    <Wrapper
      header={<Wrapper.Header title={`Category`} />}
      leftSidebar={<CategoryList />}
      actionBar={
        <Wrapper.ActionBar left={leftActionBar} right={actionBarLeft} />
      }
      footer={<Pagination count={2} />}
      transparent={true}
      content={<CourseListConteiner />}
      hasBorder
    />
  );
}
