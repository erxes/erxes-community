import { Box, Button, ControlLabel, Icon, Sidebar as CommonSideBar, Tip, __ } from '@erxes/ui/src';
import React from 'react';
import { ContainerBox } from '../../style';
import GroupListContainer from '../group/containers/List';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFilter = () => {
    return (
      <Box title='Filter List'>
        <ContainerBox horizontal vertical spaceBetween>
          <ControlLabel>Sort:</ControlLabel>
          <Button btnStyle='link'>
            <Tip text={__('Sort create date')}>
              <Icon icon='sort' size={15} />
            </Tip>
          </Button>
        </ContainerBox>
      </Box>
    );
  };

  render() {
    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <GroupListContainer {...this.props} />
          {this.renderFilter()}
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
export default SideBar;
