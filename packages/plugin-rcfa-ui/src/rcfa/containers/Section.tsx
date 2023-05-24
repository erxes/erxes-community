import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Section from '../components/Section';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';
import { Alert, Spinner } from '@erxes/ui/src';

type Props = {
  mainTypeId: string;
  mainType: string;
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  rcfaDetail: any;
  addRcfaQuestions: any;
  editRcfaQuestions: any;
  deleteRcfaIssue: any;
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
      deleteRcfaIssue,
      mainType,
      mainTypeId
    } = this.props;

    if (rcfaDetail.loading) {
      return <Spinner />;
    }

    const addIssue = data => {
      const payload = {
        ...data,
        mainType: mainType,
        mainTypeId: mainTypeId
      };
      addRcfaQuestions({ variables: payload });
    };

    const editIssue = (_id: string, issue: string) => {
      editRcfaQuestions({ variables: { _id, issue } }).catch(err =>
        Alert.error(err.message)
      );
    };

    const removeIssue = (_id: string) => {
      deleteRcfaIssue({ variables: { _id } }).catch(err =>
        Alert.error(err.message)
      );
    };

    const { issues, ...detail } = rcfaDetail?.rcfaDetail || {};

    const updateProps = {
      issues: issues || [],
      detail,
      addIssue,
      editIssue,
      removeIssue,
      mainType,
      mainTypeId
    };

    return <Section {...updateProps} />;
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
    graphql<Props>(gql(mutations.addIssue), {
      name: 'addRcfaQuestions',
      options: props => ({ refetchQueries: refetchQueries(props) })
    }),
    graphql<Props>(gql(mutations.editIssue), {
      name: 'editRcfaQuestions',
      options: props => ({ refetchQueries: refetchQueries(props) })
    }),
    graphql<Props>(gql(mutations.removeIssue), {
      name: 'deleteRcfaIssue',
      options: props => ({ refetchQueries: refetchQueries(props) })
    })
  )(SectionContainer)
);
