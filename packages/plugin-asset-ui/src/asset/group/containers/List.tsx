import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import * as compose from 'lodash.flowright';
import List from '../components/List';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';
import { IAssetGroupQeuryResponse, IAssetGroupsTotalCountResponse } from '../../../common/types';
import { Alert, confirm } from '@erxes/ui/src';
type Props = { history?: any; queryParams: any };

type FinalProps = {
  assetGroups: IAssetGroupQeuryResponse;
  assetGroupRemove: any;
  assetGroupsTotalCount: IAssetGroupsTotalCountResponse;
} & Props;

class ListContainer extends React.Component<FinalProps> {
  render() {
    const {
      assetGroups,
      assetGroupsTotalCount,
      assetGroupRemove,
      queryParams,
      history
    } = this.props;

    const removeAssetGroup = _id => {
      confirm().then(() => {
        assetGroupRemove({ variables: { _id } })
          .then(() => {
            assetGroups.refetch();
            Alert.success(`You successfully deleted a asset group`);
          })
          .catch(e => {
            Alert.error(e.message);
          });
      });
    };

    const updateProps = {
      assetGroups: assetGroups.assetGroups,
      totalCount: assetGroupsTotalCount.assetGroupsTotalCount,
      loading: assetGroups.loading,
      remove: removeAssetGroup,
      refetchAssetGroups: assetGroups.refetch,
      queryParams,
      history
    };

    return <List {...updateProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assetGroup', 'assetGroupTotalCount', 'assets'];
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.assetGroup), {
      name: 'assetGroups',
      options: ({ queryParams }) => ({
        variables: {
          status: queryParams?.status,
          parentId: queryParams?.parentId
        },
        refetchQueries: getRefetchQueries(),
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, IAssetGroupsTotalCountResponse>(gql(queries.assetGroupsTotalCount), {
      name: 'assetGroupsTotalCount'
    }),
    graphql<Props>(gql(mutations.assetGroupRemove), {
      name: 'assetGroupRemove'
    })
  )(ListContainer)
);
