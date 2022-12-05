import { __, DataWithLoader, Pagination, Table, Wrapper } from '@erxes/ui/src';
import { IRouterProps } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { TableWrapper } from '../../styles';
import { IOverallWork } from '../types';
import Row from './Row';
import Sidebar from './Sidebar';

interface IProps extends IRouterProps {
  overallWorks: IOverallWork[];
  totalCount: number;
  bulk: any[];
  isAllSelected: boolean;
  history: any;
  queryParams: any;

  summary: any;
}

class Orders extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { overallWorks, totalCount, history, queryParams } = this.props;

    const mainContent = (
      <TableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>{__('Type')}</th>
              <th>{__('Job')}</th>
              <th>{__('Product')}</th>
              <th>{__('Count')}</th>
              <th>{__('In Branch')}</th>
              <th>{__('In Department')}</th>
              <th>{__('Out Branch')}</th>
              <th>{__('Out Department')}</th>
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
          <Wrapper.Header title={__(`Overall works`)} submenu={menuNavs} />
        }
        leftSidebar={<Sidebar queryParams={queryParams} history={history} />}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={false}
            count={totalCount}
            emptyText="Add in your first work!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(Orders);
