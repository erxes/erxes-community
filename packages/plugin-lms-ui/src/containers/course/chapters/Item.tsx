import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';

import { Alert, confirm } from '@erxes/ui/src/utils';
import { IUnit } from '@erxes/ui/src/team/types';
import Item from '../../../components/course/chapters/Item';
import { queries, mutations } from '../../../graphql';
import { Box, EmptyState, ErrorMsg, Spinner } from '@erxes/ui/src/components';
import { __ } from '@erxes/ui/src/utils/core';
import { MenuFooter } from '@erxes/ui-cards/src/boards/styles/rightMenu';

type Props = {
  chapter: any;
  refetch: () => void;
};

export default function ItemContainer(props: Props) {
  const { chapter } = props;
  let lessons = {} as any;
  //   const lessons =
  if (chapter) {
    lessons = useQuery(gql(queries.lmsLessons), {
      variables: { chapterId: chapter._id || '0' }
    });
  }
  const [deleteMutation] = useMutation(gql(mutations.lmsLessonRemove));

  const deleteLesson = (_id: string, callback: () => void) => {
    confirm().then(() => {
      deleteMutation({ variables: { id: _id } })
        .then(() => {
          callback();

          Alert.success('Successfully deleted');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  if (lessons?.loading) {
    return <Spinner />;
  }

  if (lessons?.error) {
    return (
      <Box isOpen={true} title={__('Lesson')} name="showLesson">
        <MenuFooter>
          <ErrorMsg>{lessons.error.message}</ErrorMsg>
        </MenuFooter>
      </Box>
    );
  }

  const AllLessons = lessons.data.lmsLessons || [];

  if (AllLessons.length === 0) {
    return <EmptyState icon="ban" text="No lessonss" size="small" />;
  }
  return <Item {...props} deleteLesson={deleteLesson} lessons={lessons} />;
}
