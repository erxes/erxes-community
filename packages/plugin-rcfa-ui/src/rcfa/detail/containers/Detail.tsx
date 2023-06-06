import React from 'react';
import { __, withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import { queries } from '../../graphql';
import { jsPlumb } from 'jsplumb';
import jquery from 'jquery';
import { EmptyState, Spinner } from '@erxes/ui/src';
import DetailComponent from '../components/Detail';

type Props = {
  rcfaDetailQueryResponse?: any;
  id: string;
  history: any;
  queryParams: any;
};

class RcfaDetail extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { rcfaDetailQueryResponse } = this.props;

    const { loading, error, rcfaDetail } = rcfaDetailQueryResponse;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <EmptyState text="RCFA not found" image="/images/actions/24.svg" />
      );
    }

    const updatedProps = {
      detail: rcfaDetail
    };

    console.log({ updatedProps });

    return <DetailComponent {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfaDetail), {
      name: 'rcfaDetailQueryResponse',
      options: (props: any) => ({
        variables: {
          _id: props.match.params.id
        }
      })
    })
  )(RcfaDetail)
);
