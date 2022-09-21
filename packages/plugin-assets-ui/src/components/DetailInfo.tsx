import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { IAssets } from '../types';

type Props = {
  assets: IAssets;
};

class DetailInfo extends React.Component<Props> {
  renderRow = (label, value) => {
    return (
      <li>
        <FieldStyle>{__(`${label}`)}</FieldStyle>
        <SidebarCounter>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  render() {
    const { assets } = this.props;

    return (
      <SidebarList className="no-link">
        {this.renderRow('Нэр', assets.name)}
      </SidebarList>
    );
  }
}

export default DetailInfo;
