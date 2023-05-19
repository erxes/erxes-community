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
  rcfaDetail: any;
  addRcfaQuestions: any;
  editRcfaQuestions: any;
  deleteRcfaQuestions: any;
} & Props;

class SectionContainer extends React.Component<FinalProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {
      rcfaDetail,
      addRcfaQuestions,
      editRcfaQuestions,
      deleteRcfaQuestions
    } = this.props;
    let questions = [];

    if (!rcfaDetail.loading) {
      if (rcfaDetail.rcfaDetail) {
        questions = rcfaDetail.rcfaDetail.questions;
      } else {
        questions = rcfaDetail.rcfaDetail;
      }
    }

    const createQuestion = (question: string, parentId: string | null) => {
      const payload = {
        question,
        parentId,
        mainType: 'ticket',
        mainTypeId: this.props.mainTypeId
      };
      addRcfaQuestions({ variables: payload });
    };

    const editQuestion = (id: string, question: string) => {
      editRcfaQuestions({ variables: { id, question } });
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
        ticketId={this.props.mainTypeId}
      />
    );
  }
}

const refetchQueries = ({ mainTypeId }) => [
  {
    query: gql(queries.rcfa),
    variables: {
      mainType: 'ticket',
      mainTypeId: mainTypeId
    }
  }
];

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfa), {
      name: 'rcfaDetail',
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
