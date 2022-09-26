import { Button, ControlLabel, Icon, Tip, __ } from '@erxes/ui/src';
import React from 'react';
import { ContainerBox } from '../../style';
import GroupListContainer from '../group/containers/List';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFilter = () => {
    return (
      <ContainerBox horizontal vertical spaceBetween>
        <ControlLabel>Sort:</ControlLabel>
        <Tip text={__('Sort create date')}>
          <Button btnStyle='link'>
            <Icon icon='sort' size={15} />
          </Button>
        </Tip>
      </ContainerBox>
    );
  };

  render() {
    return (
      <ContainerBox column gap={5}>
        <GroupListContainer />
        {this.renderFilter()}
      </ContainerBox>
    );
  }
}
export default SideBar;
