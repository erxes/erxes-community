import {
  __,
  DataWithLoader,
  Pagination,
  Table,
  Wrapper,
  BarItems
} from '@erxes/ui/src';
import { IRouterProps, IQueryParams } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { TableWrapper } from '../../styles';
import { IOverallWork } from '../types';
import HeaderDescription from './MainHead';
import RightMenu from './RightMenu';
import Row from './Row';

interface IProps extends IRouterProps {
  overallWorks: IOverallWork[];
  totalCount: number;
  bulk: any[];
  isAllSelected: boolean;
  history: any;
  queryParams: any;

  onSearch: (search: string) => void;
  onFilter: (filterParams: IQueryParams) => void;
  onSelect: (values: string[] | string, key: string) => void;
  isFiltered: boolean;
  clearFilter: () => void;
  summary: any;
}

class Orders extends React.Component<IProps, {}> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);
  }

  moveCursorAtTheEnd = e => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      overallWorks,
      totalCount,
      history,
      queryParams,
      onFilter,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      summary
    } = this.props;

    const rightMenuProps = {
      onFilter,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      queryParams
    };

    const actionBarRight = (
      <BarItems>
        <RightMenu {...rightMenuProps} />
      </BarItems>
    );

    const header = (
      <HeaderDescription
        icon="/images/actions/26.svg"
        title={__('Summary')}
        summary={summary}
        actionBar={actionBarRight}
      />
    );

    const mainContent = (
      <TableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>{__('Type')}</th>
              <th>{__('Job')}</th>
              <th>{__('Product')}</th>
              <th>{__('In Branch')}</th>
              <th>{__('In Department')}</th>
              <th>{__('Out Branch')}</th>
              <th>{__('Out Department')}</th>
              <th>{__('Count')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody id="overallWorks">
            {(overallWorks || []).map(work => (
              <Row work={work} key={Math.random()} history={history} />
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Pos Orders`)}
            queryParams={queryParams}
            submenu={menuNavs}
          />
        }
        mainHead={header}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={false}
            count={(overallWorks || []).length}
            emptyText="Add in your first work!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(Orders);
