import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { Title } from '@erxes/ui/src/styles/main';
import CategoryList from '../containers/category/CategoryList';
import CourseListConteiner from '../containers/course/CourseList';
import CourseFormContainer from '../containers/course/CourseForm';

type Props = {
  history: any;
};
export default function LmsComponent(props: Props) {
  const trigger = (
    <Button btnStyle="primary" icon="plus-circle">
      Add Course
    </Button>
  );

  const content = props => (
    <CourseFormContainer
      {...props}
      // queryParams={queryParams}
      // currentCategoryId={currentCategory._id}
      // topicId={currentCategory.firstTopic && currentCategory.firstTopic._id}
      categoryId={'1'}
    />
  );
  const leftActionBar = <Title>Courses</Title>;
  console.log(props, 'hey');
  // const actionBarLeft = (
  //   <Button
  //     btnStyle="primary"
  //     icon="plus-circle"
  //     onClick={() => {
  //       props.history.push(`/lms/course`);
  //     }}
  //   >
  //     Create new course
  //   </Button>
  // );

  const actionBarLeft = (
    <ModalTrigger
      title="Create new course"
      trigger={trigger}
      size="lg"
      autoOpenKey="showKBAddArticleModal"
      content={content}
      enforceFocus={false}
    />
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
