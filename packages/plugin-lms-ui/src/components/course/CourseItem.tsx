// import { Title } from '@erxes/ui-settings/src/styles';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { Title } from '@erxes/ui-settings/src/styles';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import FormContainer from '../../containers/course/chapters/Form';
import ChapterList from '../../containers/course/chapters/List';
import LessonForm from '../../containers/course/lessons/LessonForm';
import queryString from 'query-string';
// import LeftSidebar from './chapters/Sidebar';
type Props = {
  queryParams: any;
  location: any;
};
export default function CourseItemComponent(props: Props) {
  const { location } = props;
  const queryParams = queryString.parse(location.search);
  console.log('reRendered queryParams:', queryParams);
  const righActionBar = (
    <>
      <Title>{__('Lessons')}</Title>
      <span>Deliver learning content</span>
    </>
  );
  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={`Chapter`}
          breadcrumb={[
            { title: __('Lms'), link: '/lms/' },
            { title: __('Chapter') }
          ]}
        />
      }
      leftSidebar={<ChapterList />}
      actionBar={<Wrapper.ActionBar left={righActionBar} />}
      transparent={true}
      content={<LessonForm queryParams={queryParams} />}
      hasBorder
    />
  );
}
