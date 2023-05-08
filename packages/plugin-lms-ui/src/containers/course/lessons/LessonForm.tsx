import * as compose from 'lodash.flowright';

import {
  IArticle,
  TopicsQueryResponse
} from '@erxes/ui-knowledgebase/src/types';
import { mutations, queries } from '../../../graphql';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import React from 'react';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import LessonForm, {
  ChooseLessonTypeForm
} from '../../../components/course/Lessons/LessonForm';
import { Spinner } from '@erxes/ui/src/components';
import { LessonDetailQueryResponse } from '../../../types';

type Props = {
  lesson: IArticle;
  currentCategoryId: string;
  queryParams: any;
  topicIds: string[];
  closeModal: () => void;
};

type FinalProps = {
  topicsQuery?: TopicsQueryResponse;
  lessonDetailQuery: any;
} & Props;

const LessonFormContainer = (props: FinalProps) => {
  const {
    lesson,
    queryParams,
    topicIds,
    currentCategoryId,
    topicsQuery,
    lessonDetailQuery
  } = props;
  // console.log(lessonDetailQuery, 'lessonDetailQuery');

  if (lessonDetailQuery.loading) {
    return <Spinner />;
  }
  const renderButton = ({
    passedName: name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    console.log(values, 'values');
    console.log('lfCo:', object);
    return (
      <ButtonMutate
        mutation={
          object?._id ? mutations.lmsLessonEdit : mutations.lmsLessonAdd
        }
        variables={values}
        callback={callback}
        refetchQueries={() => {}}
        type="submit"
        isSubmitted={isSubmitted}
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } an ${name}`}
      />
    );
  };
  console.log(lessonDetailQuery, 'lessonDetailQuery');
  const extendedProps = {
    ...props,
    renderButton,
    lesson,
    currentCategoryId,
    // topics: topicsQuery.knowledgeBaseTopics || []
    lessonDetail: lessonDetailQuery.lmsLessonDetail || []
  };

  return <LessonForm {...extendedProps} />;
};

export default compose(
  graphql<Props, LessonDetailQueryResponse>(gql(queries.lmsLessonDetail), {
    name: 'lessonDetailQuery',
    // skip: ({ queryParams }) => !queryParams,
    options: ({ queryParams }: { queryParams: any }) => (
      console.log(queryParams, 'qp'),
      {
        variables: { id: queryParams?.id || '0' },
        fetchPolicy: 'network-only'
      }
    )
  })
)(LessonFormContainer);
// export default LessonFormContainer;

export function ChooseLessonTypeFormContainer() {
  const renderButton = ({
    passedName: name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    console.log('lfCo:', object);
    return (
      <ButtonMutate
        mutation={object ? mutations.lmsLessonEdit : mutations.lmsLessonAdd}
        variables={values}
        callback={callback}
        refetchQueries={() => {}}
        type="submit"
        isSubmitted={isSubmitted}
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } an ${name}`}
      />
    );
  };

  return <ChooseLessonTypeForm renderButton={renderButton} />;
}
