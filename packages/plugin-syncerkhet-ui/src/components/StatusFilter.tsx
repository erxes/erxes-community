import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps, Counts } from '@erxes/ui/src/types';
import {
  BarItems,
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { statusFilters } from '../types';
import { router, __ } from '@erxes/ui/src/utils/core';
import Button from '@erxes/ui/src/components/Button';

interface IProps extends IRouterProps {
  items: any;
  emptyText?: string;
}

function StatusFilter({ history, items, emptyText }: IProps) {
  const data = (
    <SidebarList>
      {statusFilters.map((status, index) => {
        const onClick = () => {
          router.setParams(history, { stat: status.key });
          router.removeParams(history, 'page');
        };

        return (
          <li key={index}>
            <a
              href="#filter"
              tabIndex={0}
              className={
                router.getParam(history, 'stat') === status.key ? 'active' : ''
              }
              onClick={onClick}
            >
              <FieldStyle>{__(status.value)}</FieldStyle>
              <SidebarCounter>
                {items[status.key] ? items[status.key].count : 'NaN'}
              </SidebarCounter>
            </a>
          </li>
        );
      })}
    </SidebarList>
  );
  // const buttons = (
  //   <BarItems>
  //     <Button
  //       btnStyle="primary"
  //       size="small"
  //       icon="check-1"
  //       onClick={() => {}}
  //     >
  //       Create
  //     </Button>
  //     <Button
  //       btnStyle="primary"
  //       size="small"
  //       icon="check-1"
  //       onClick={() => {}}
  //     >
  //       Check
  //     </Button>
  //     <Button
  //       btnStyle="primary"
  //       size="small"
  //       icon="check-1"
  //       onClick={() => {}}
  //     >
  //       Check
  //     </Button>
  //   </BarItems>
  // );
  return (
    <Box
      title={__('Filter by status')}
      collapsible={statusFilters.length > 5}
      name="showFilterByStatus"
    >
      <DataWithLoader
        data={data}
        loading={false}
        count={statusFilters.length}
        emptyText={emptyText ? emptyText : 'Loading'}
        emptyIcon="leaf"
        size="large"
        objective={true}
      />
    </Box>
  );
}

export default withRouter<IProps>(StatusFilter);
