import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries } from '../graphql';

type Props = {
  item: any;
  rcfaDetail?: any;
};

interface IQuestion {
  _id: string;
  question: string;
  parentId: string;
  rcfaId: string;
  createdAt: string;
  createdUser: string;
  __v: number;
}

class TableDetail extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { rcfaDetail } = this.props;
    let rcfa = null;
    let questions = <></>;

    if (!rcfaDetail.loading) {
      rcfa = rcfaDetail.rcfaDetail;

      questions = rcfaDetail.rcfaDetail.questions.map(
        (question: IQuestion, index: number) => (
          <div key={index}>
            <h5>
              {index === 0 ? 'Problem: ' : ''}
              {index === rcfaDetail.rcfaDetail.questions.length - 1
                ? 'Root cause: '
                : ''}
              {question.question}
            </h5>
          </div>
        )
      );
    }

    return <div>{questions}</div>;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfa), {
      name: 'rcfaDetail',
      options: (props: any) => ({
        variables: {
          _id: props.item._id
        }
      })
    })
  )(TableDetail)
);
