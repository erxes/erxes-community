import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import Detail from '../components/Detail';
import React from 'react';
import { graphql } from 'react-apollo';
import { IWork } from '../types';
import { WorkDetailQueryResponse } from '../types';
import { queries, mutations } from '../graphql';
import { Spinner, withProps } from '@erxes/ui/src';

type Props = {
  work: IWork;
};

type FinalProps = {
  workDetailQuery: WorkDetailQueryResponse;
} & Props;

class OrdersDetailContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const { workDetailQuery } = this.props;

    if (workDetailQuery.loading) {
      return <Spinner />;
    }

    const work = workDetailQuery.workDetail;

    const updatedProps = {
      ...this.props,
      work
    };

    return <Detail {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, WorkDetailQueryResponse, { _id: string }>(
      gql(queries.posOrderDetail),
      {
        name: 'workDetailQuery',
        options: ({ work }) => ({
          variables: {
            _id: work._id || ''
          },
          fetchPolicy: 'network-only'
        })
      }
    )
  )(OrdersDetailContainer)
);
