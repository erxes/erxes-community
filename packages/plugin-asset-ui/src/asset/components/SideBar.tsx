import { Box, Button, ControlLabel, Icon, Sidebar as CommonSideBar, Tip, __ } from '@erxes/ui/src';
import React from 'react';
import { ContainerBox } from '../../style';
import GroupListContainer from '../group/containers/List';

type Props = {
  queryParams: any;
  history: any;
};

class SideBar extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <GroupListContainer {...this.props} />
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
export default SideBar;
