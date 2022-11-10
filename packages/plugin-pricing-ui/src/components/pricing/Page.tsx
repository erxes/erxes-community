import React from 'react';
// erxes
import { __ } from '@erxes/ui/src';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
// import WithPermission from 'coreui/withPermission';
// local
import List from './List';
import ActionBar from '../../containers/pricing/ActionBar';

const Pricing = () => {
  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Pricing') }
  ];

  return (
    // <WithPermission action='showPricing'>
    <Wrapper
      header={<Wrapper.Header title={__('Pricing')} breadcrumb={breadcrumb} />}
      content={<List data={[]} refetch={() => {}} loading={false} />}
      actionBar={<ActionBar />}
      transparent={true}
      hasBorder
    />
    // </WithPermission>
  );
};

export default Pricing;
