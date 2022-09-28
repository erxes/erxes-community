import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import * as compose from 'lodash.flowright';
import List from '../components/List';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';
import { IAssetGroupQeuryResponse } from '../../../common/types';
import { Alert, confirm } from '@erxes/ui/src';
type Props = { history?: any; queryParams?: any };

type FinalProps = {
  assetGroups: IAssetGroupQeuryResponse;
  assetGroupRemove: any;
} & Props;

class ListContainer extends React.Component<FinalProps> {
  render() {
    const { assetGroups, assetGroupRemove } = this.props;

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
      assetGroups: assetGroups.assetGroup?.list,
      totalCount: assetGroups.assetGroup?.totalCount,
      loading: assetGroups.loading,
      remove: removeAssetGroup,
      refetchAssetGroups: assetGroups.refetch
    };

    return <List {...updateProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.assetGroup), {
      name: 'assetGroups'
      // options: ({ queryParams }) => ({
      //   variables: {
      //     status: queryParams.status,
      //     parentId: queryParams.parentId
      //   },
      //   // refetchQueries: getRefetchQueries(),
      //   fetchPolicy: 'network-only'
      // })
    }),
    graphql<Props>(gql(mutations.assetGroupRemove), {
      name: 'assetGroupRemove'
    })
  )(ListContainer)
);
