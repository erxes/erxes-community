import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import React from 'react';

import BasicInfo from '../containers/BasicInfo';
import { IAssets } from '../types';

type Props = {
  assets: IAssets;
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { assets } = this.props;

    return (
      <Sidebar wide={true}>
        <BasicInfo assets={assets} />
      </Sidebar>
    );
  }
}

export default LeftSidebar;
