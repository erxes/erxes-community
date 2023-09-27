import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from '@erxes/ui/src/utils';
import { Spinner } from '@erxes/ui/src/components';
import React from 'react';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../../graphql';
import { AssetsConfigsQueryResponse, IConfigsMap, UomsQueryResponse } from '../../types';

type Props = {
  component: any;
};
type FinalProps = {
  assetsConfigsQuery: AssetsConfigsQueryResponse;
  uomsQuery: UomsQueryResponse;
  updateConfigs: (configsMap: IConfigsMap) => Promise<void>;
} & Props;

class SettingsContainer extends React.Component<FinalProps> {
  render() {
    const { updateConfigs, assetsConfigsQuery, uomsQuery } = this.props;

    if (assetsConfigsQuery.loading || uomsQuery.loading) {
      return <Spinner objective={true} />;
    }

    // create or update action
    const save = (map: IConfigsMap) => {
      updateConfigs({
        variables: { configsMap: map }
      })
        .then(() => {
          assetsConfigsQuery.refetch();
          Alert.success('You successfully updated settings');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    };

    const configs = assetsConfigsQuery.assetsConfigs || [];

    const configsMap = {};

    for (const config of configs) {
      configsMap[config.code] = config.value;
    }

    const Component = this.props.component;
    return <Component {...this.props} configsMap={configsMap} save={save} uoms={uomsQuery.uoms} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<{}, AssetsConfigsQueryResponse>(gql(queries.assetsConfigs), {
      name: 'assetsConfigsQuery'
    }),
    graphql<{}, UomsQueryResponse>(gql(queries.uoms), {
      name: 'uomsQuery'
    }),
    graphql<{}>(gql(mutations.assetsConfigsUpdate), {
      name: 'updateConfigs'
    })
  )(SettingsContainer)
);
