import { IRouterProps } from '@erxes/ui/src/types';
import { withRouter } from 'react-router-dom';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import Detail from '../components/Detail';
import React from 'react';
import { graphql } from 'react-apollo';
import { IOverallWork } from '../types';
import { OverallWorkDetailQueryResponse } from '../types';
import { queries } from '../graphql';
import { Spinner, withProps } from '@erxes/ui/src';

type Props = {
  work: IOverallWork;
};

type FinalProps = {
  overallWorkDetailQuery: OverallWorkDetailQueryResponse;
} & Props &
  IRouterProps;

class OrdersDetailContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const { overallWorkDetailQuery } = this.props;

    if (overallWorkDetailQuery.loading) {
      return <Spinner />;
    }

    const work = overallWorkDetailQuery.overallWorkDetail;

    const updatedProps = {
      ...this.props,
      work
    };

    return <Detail {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<{ queryParams }, OverallWorkDetailQueryResponse, {}>(
      gql(queries.overallWorkDetail),
      {
        name: 'overallWorkDetailQuery'
        // options: ({ work }) => ({
        //   variables: {
        //     _id: work._id || ''
        //   },
        //   fetchPolicy: 'network-only'
        // })
      }
    )
  )(withRouter<IRouterProps>(OrdersDetailContainer))
);
