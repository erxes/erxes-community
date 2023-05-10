import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Section from '../components/Section';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';

type Props = {
  mainTypeId: string;
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  getQuestions: any;
  addRcfaQuestions: any;
  editRcfaQuestions: any;
  deleteRcfaQuestions: any;
} & Props;

class SectionContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      getQuestions,
      addRcfaQuestions,
      editRcfaQuestions,
      deleteRcfaQuestions
    } = this.props;

    let questions = [];
    if (!getQuestions.loading) {
      questions = getQuestions.rcfaQuestions;
    }

    const createQuestion = (title: string) => {
      const payload = {
        title,
        mainType: 'ticket',
        mainTypeId: this.props.mainTypeId
      };
      addRcfaQuestions({ variables: payload });
    };

    const editQuestion = (id: string, title: string) => {
      editRcfaQuestions({ variables: { id, title } });
    };

    const deleteQuestion = (id: string) => {
      deleteRcfaQuestions({ variables: { id } });
    };

    return (
      <Section
        questions={questions}
        createQuestion={createQuestion}
        editQuestion={editQuestion}
        deleteQuestion={deleteQuestion}
      />
    );
  }
}

const refetchQueries = ({ mainTypeId }) => [
  {
    query: gql(queries.getQuestions),
    variables: {
      mainType: 'ticket',
      mainTypeId: mainTypeId
    }
  }
];

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getQuestions), {
      name: 'getQuestions',
      options: (props: any) => ({
        variables: {
          mainType: 'ticket',
          mainTypeId: props.mainTypeId
        }
      })
    }),
    graphql<Props>(gql(mutations.addQuestion), {
      name: 'addRcfaQuestions',
      options: props => ({ refetchQueries: refetchQueries(props) })
    }),
    graphql<Props>(gql(mutations.editQuestion), {
      name: 'editRcfaQuestions',
      options: props => ({ refetchQueries: refetchQueries(props) })
    }),
    graphql<Props>(gql(mutations.deleteQuestion), {
      name: 'deleteRcfaQuestions',
      options: props => ({ refetchQueries: refetchQueries(props) })
    })
  )(SectionContainer)
);
