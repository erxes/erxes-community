import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { MenuFooter, SidebarFilters } from '../../styles';
import { SidebarList as List } from '@erxes/ui/src/layout';
import { Wrapper } from '@erxes/ui/src/layout';
import { IQueryParams } from '@erxes/ui/src/types';
import Button from '@erxes/ui/src/components/Button';
import { IOverallWorkDet } from '../types';

interface Props {
  work: IOverallWorkDet;
  queryParams: any;
}

type State = {
  filterParams: IQueryParams;
};

const { Section } = Wrapper.Sidebar;

class DetailRightSidebar extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      filterParams: this.props.queryParams
    };
  }

  render() {
    const { filterParams } = this.state;

    return (
      <Wrapper.Sidebar hasBorder wide={true}>
        <Section.Title>
          {__('Filters')}
          <Section.QuickButtons></Section.QuickButtons>
        </Section.Title>
        <SidebarFilters>
          <List id="SettingsSidebar"></List>
          <MenuFooter>
            <Button
              block={true}
              btnStyle="success"
              uppercase={false}
              onClick={() => {}}
              icon="filter"
            >
              {__('Filter')}
            </Button>
          </MenuFooter>
        </SidebarFilters>
      </Wrapper.Sidebar>
    );
  }
}

export default DetailRightSidebar;
