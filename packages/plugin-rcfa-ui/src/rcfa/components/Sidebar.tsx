import React from 'react';
import { Sidebar as CommonSidebar, __ } from '@erxes/ui/src';
import { SidebarHeader } from '../../styles';

type Props = {
  history: any;
  queryParams: any;
};

class SideBar extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CommonSidebar
        full
        header={<SidebarHeader>{__('Additional Filter')}</SidebarHeader>}
      >
        sidebar
      </CommonSidebar>
    );
  }
}
export default SideBar;
