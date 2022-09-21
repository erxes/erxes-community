import { EmptyState, Spinner, withProps } from '@erxes/ui/src';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';

import AssetsDetail from '../components/AssetsDetail';
import { queries } from '../graphql';
import { DetailQueryResponse } from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  assetsDetailQuery: DetailQueryResponse;
} & Props;

const assetsDetailsContainer = (props: FinalProps) => {
  const { id, assetsDetailQuery } = props;

  if (assetsDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!assetsDetailQuery.assetsDetail) {
    return (
      <EmptyState text="Assets not found" image="/images/actions/24.svg" />
    );
  }

  const assetsDetail = assetsDetailQuery.assetsDetail;

  const updatedProps = {
    ...props,
    loading: assetsDetailQuery.loading,
    assets: assetsDetail
  };

  return <AssetsDetail {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, DetailQueryResponse, { _id: string }>(
      gql(queries.assetsDetail),
      {
        name: 'assetsDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id
          }
        })
      }
    )
  )(assetsDetailsContainer)
);
