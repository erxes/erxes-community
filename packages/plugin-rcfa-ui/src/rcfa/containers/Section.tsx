import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Section from '../components/Section';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  getQuestions: any;
} & Props;

class SectionContainer extends React.Component<FinalProps> {
  state: any = {};

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      id: props.id
    };
  }

  render() {
    const { getQuestions } = this.props;

    let questions = [];
    if (!getQuestions.loading) {
      questions = getQuestions.rcfaQuestions;
    }

    return <Section ticketId={this.state.id} questions={questions} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getQuestions), {
      name: 'getQuestions',
      options: props => ({
        variables: { ticketId: props }
      })
    })
  )(SectionContainer)
);
