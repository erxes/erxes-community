import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';

import Spinner from '@erxes/ui/src/components/Spinner';

import Box from '@erxes/ui/src/components/Box';
import ErrorMsg from '@erxes/ui/src/components/ErrorMsg';
import List from '../../../components/course/chapters/List';
import { __ } from '@erxes/ui/src/utils/core';
import { MenuFooter } from '@erxes/ui-cards/src/boards/styles/rightMenu';
import { queries } from '../../../graphql';

export default function ListContainer() {
  const chapters = useQuery(gql(queries.lmsChapters), {
    variables: { courseId: '1231' }
  });

  if (chapters.loading) {
    return <Spinner />;
  }

  if (chapters.error) {
    return (
      <Box isOpen={true} title={__('Chapter')} name="showChapter">
        <MenuFooter>
          <ErrorMsg>{chapters.error.message}</ErrorMsg>
        </MenuFooter>
      </Box>
    );
  }

  return <List chapters={chapters} key={Math.random()} />;
}
