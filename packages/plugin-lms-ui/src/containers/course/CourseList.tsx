import { MenuFooter } from '@erxes/ui-cards/src/boards/styles/rightMenu';
import { Box, ErrorMsg, Spinner } from '@erxes/ui/src/components';
import { __ } from '@erxes/ui/src/utils';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import CourseList from '../../components/course/CourseList';
import { queries } from '../../graphql';
import queryString from 'query-string';

export default function CourseListConteiner(props: any) {
  const queryParams = queryString.parse(location.search);
  console.log(queryParams, 'queryParams');

  const courses = useQuery(gql(queries.lmsCourses), {
    variables: { categoryId: queryParams.id }
  });

  if (courses.loading) {
    return <Spinner />;
  }

  if (courses.error) {
    return (
      <Box isOpen={true} title={__('Courses')} name="showCourses">
        <MenuFooter>
          <ErrorMsg>{courses.error.message}</ErrorMsg>
        </MenuFooter>
      </Box>
    );
  }

  return <CourseList courses={courses.data} key={Math.random()} />;
}
