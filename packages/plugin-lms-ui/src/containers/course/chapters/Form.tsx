import React from 'react';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';
// import { mutations, queries } from '@erxes/ui/src/team/graphql';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Spinner from '@erxes/ui/src/components/Spinner';
import ChapterForm from '../../../components/course/chapters/Form';
import { mutations, queries } from '../../../graphql';

type Props = {
  chapter?: any;
  closeModal: () => void;
  lesson?: any;
};

const ChapterFormContainer = (props: Props) => {
  console.log('chapter form called', props);
  // const { data, loading } = useQuery(gql(queries.departments), {
  //   fetchPolicy: 'network-only'
  // });

  // if (loading) {
  //   return <Spinner />;
  // }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    object,
    callback
  }: IButtonMutateProps) => {
    console.log(values, 'values');
    return (
      <ButtonMutate
        mutation={
          object._id ? mutations.lmsChapterEdit : mutations.lmsChapterAdd
        }
        refetchQueries={[
          {
            query: gql(queries.lmsChapters)
          }
        ]}
        variables={values}
        isSubmitted={isSubmitted}
        type="submit"
        callback={callback}
        successMessage={`You successfully ${
          object._id ? 'updated' : 'added'
        } a ${name}`}
      />
    );
  };

  return (
    <ChapterForm
      // departments={data.departments}
      {...props}
      renderButton={renderButton}
    />
  );
};

export default ChapterFormContainer;
