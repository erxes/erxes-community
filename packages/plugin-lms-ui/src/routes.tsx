import React from 'react';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import { Route } from 'react-router-dom';

const Lms = asyncComponent(() =>
  import(/* webpackChunkName: "KnowledgeBase" */ './containers/Lms')
);
const Category = asyncComponent(() =>
  import(
    /* webpackChunkName: "KnowledgeBase" */ './containers/category/CategoryList'
  )
);
const Course = asyncComponent(() =>
  import(
    /* webpackChunkName: "KnowledgeBase" */ './containers/course/CourseItem'
  )
);

const Lesson = asyncComponent(() =>
  import(
    /* webpackChunkName: "KnowledgeBase" */ './containers/course/lessons/LessonForm'
  )
);

const routes = () => (
  <React.Fragment>
    <Route path="/lms/" component={Lms} exact />
    <Route path="/lms/course" component={Course} exact />
    <Route path="/lms/course?id=" component={Lesson} exact />
    <Route path="/lms/category" component={Lms} exact />
  </React.Fragment>
);

export default routes;
