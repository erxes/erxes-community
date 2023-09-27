import gql from 'graphql-tag';
import TaggerSection from '@erxes/ui-contacts/src/customers/components/common/TaggerSection';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import BasicInfo from '../../../containers/asset/detail/BasicInfo';
import CustomFieldsSection from '../../../containers/asset/detail/CustomFieldsSection';
import { IAsset } from '../../../types';
import React from 'react';
import { queries } from '../../../graphql';
import { isEnabled } from '@erxes/ui/src/utils/core';

type Props = {
  asset: IAsset;
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { asset } = this.props;

    const refetchQueries = [
      {
        query: gql(queries.assetDetail),
        variables: { _id: asset._id }
      }
    ];

    return (
      <Sidebar wide={true}>
        <BasicInfo asset={asset} refetchQueries={refetchQueries} />
        <CustomFieldsSection asset={asset} />
        {isEnabled('tags') && (
          <TaggerSection data={asset} type="assets:asset" refetchQueries={refetchQueries} />
        )}
      </Sidebar>
    );
  }
}

export default LeftSidebar;
