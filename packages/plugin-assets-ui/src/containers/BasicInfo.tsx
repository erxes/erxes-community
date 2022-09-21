import { Alert, withProps } from '@erxes/ui/src';
import { IUser } from '@erxes/ui/src/auth/types';
import { IRouterProps } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import BasicInfoSection from '../components/BasicInfoSection';
import { mutations } from '../graphql';
import {
  IAssets,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';

type Props = {
  assets: IAssets;
};

type FinalProps = { currentUser: IUser } & Props &
  IRouterProps &
  RemoveMutationResponse;

const BasicInfoContainer = (props: FinalProps) => {
  const { assets, assetsDelete, history } = props;

  const { _id } = assets;

  const remove = () => {
    assetsDelete({ variables: { assetsIds: [_id] } })
      .then(() => {
        Alert.success('You successfully deleted a assets');
        history.push('/assets');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    remove
  };

  return <BasicInfoSection {...updatedProps} />;
};

const generateOptions = () => ({
  refetchQueries: ['assets', 'assetsTotalCount']
});

export default withProps<Props>(
  compose(
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.assetsRemove),
      {
        name: 'assetsDelete',
        options: generateOptions
      }
    )
  )(withRouter<FinalProps>(BasicInfoContainer))
);
