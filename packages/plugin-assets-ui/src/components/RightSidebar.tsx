import * as path from 'path';

import Box from '@erxes/ui/src/components/Box';
import { List } from '../styles';
import React from 'react';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import { __ } from 'coreui/utils';
import dayjs from 'dayjs';
import { IAssets } from '../types';

type Props = {
  assets: IAssets;
};

export default class RightSidebar extends React.Component<Props> {
  render() {
    const { assets } = this.props;

    return (
      <Sidebar>
        <Box title={__('Other')} name="showOthers">
          <List>
            <li>
              <div>{__('Created at')}: </div>{' '}
              <span>{dayjs(assets.createdAt).format('lll')}</span>
            </li>
            <li>
              <div>{__('Modified at')}: </div>{' '}
              <span>{dayjs(assets.modifiedAt).format('lll')}</span>
            </li>
          </List>
        </Box>
      </Sidebar>
    );
  }
}
