import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Alert, commonListComposer } from '@erxes/ui/src/utils';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import React from 'react';
import {
  ICommonFormProps,
  ICommonListProps
} from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import {
  AssetsQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';

type Props = {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  listQuery: any;
};

type FinalProps = {
  assetsQuery: AssetsQueryResponse;
} & Props &
  RemoveMutationResponse;

class ListContainer extends React.Component<FinalProps> {
  render() {
    const { assetsQuery, assetsDelete } = this.props;

    const assets = assetsQuery.assets || [];

    const assetsRemove = ({ assetIds }, emptyBulk) => {
      assetsDelete({
        variables: { assetIds }
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a client portal user');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const updatedProps = {
      ...this.props,
      assets,
      assetsRemove
    };

    const content = props => {
      return <List {...updatedProps} {...props} />;
    };
    return <Bulk content={content} refetch={this.props.assetsQuery.refetch} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, AssetsQueryResponse>(gql(queries.assets), {
      name: 'assetsQuery',
      options: {
        fetchPolicy: 'network-only'
      }
    }),
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.assetsRemove),
      {
        name: 'assetsDelete'
      }
    )
  )(ListContainer)
);
