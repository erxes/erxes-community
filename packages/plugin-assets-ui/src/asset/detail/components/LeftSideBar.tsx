import gql from 'graphql-tag';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import BasicInfo from '../containers/BasicInfo';
import CustomFieldsSection from '../containers/CustomFieldSection';
import { IAsset } from '../../../common/types';
import React from 'react';
import { queries } from '../../graphql';

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
      </Sidebar>
    );
  }
}

export default LeftSidebar;
