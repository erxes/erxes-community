import * as path from 'path';

import EmptyState from '@erxes/ui/src/components/EmptyState';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { isEnabled } from '@erxes/ui/src/utils/core';
import { IAssets } from '../types';
import { __ } from '@erxes/ui/src/utils';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';

const ActivityInputs = asyncComponent(
  () =>
    isEnabled('logs') &&
    path.resolve(
      /* webpackChunkName: "ActivityInputs" */ '@erxes/ui-log/src/activityLogs/components/ActivityInputs'
    )
);

const ActivityLogs = asyncComponent(
  () =>
    isEnabled('logs') &&
    path.resolve(
      /* webpackChunkName: "ActivityLogs" */ '@@erxes/ui-log/src/activityLogs/containers/ActivityLogs'
    )
);

type Props = {
  assets: IAssets;
};

class AssetsDetail extends React.Component<Props> {
  renderContent(content) {
    if (isEnabled('logs')) {
      return content;
    }

    return (
      <EmptyState
        image="/images/actions/5.svg"
        text={__('No results found')}
        size="full"
      />
    );
  }

  render() {
    const { assets } = this.props;

    const title = assets.name || 'Unknown';

    const breadcrumb = [{ title: __('Assets'), link: '/assets' }, { title }];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={assets._id}
          contentType="assets"
          showEmail={false}
        />
        <ActivityLogs
          // target={assets.plateNumber || ''}
          contentId={assets._id}
          // contentType=":assets"
          extraTabs={[]}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        rightSidebar={<RightSidebar assets={assets} />}
        content={this.renderContent(content)}
        transparent={true}
      />
    );
  }
}

export default AssetsDetail;
