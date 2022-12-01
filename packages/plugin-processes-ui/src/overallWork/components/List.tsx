import {
  __,
  DataWithLoader,
  Pagination,
  SortHandler,
  Table,
  Wrapper,
  BarItems
} from '@erxes/ui/src';
import { IRouterProps, IQueryParams } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { TableWrapper } from '../../styles';
import { IWork } from '../types';
import HeaderDescription from './MainHead';
import RightMenu from './RightMenu';
import Row from './Row';

interface IProps extends IRouterProps {
  works: IWork[];
  loading: boolean;
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

  onSyncErkhet: (workId: string) => void;
  onReturnBill: (workId: string) => void;
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
      works,
      history,
      loading,
      queryParams,
      onFilter,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      summary,
      onSyncErkhet,
      onReturnBill
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
              <th>
                <SortHandler sortField={'number'} label={__('Bill number')} />
              </th>
              <th>
                <SortHandler sortField={'paidDate'} label={__('Date')} />
              </th>
              <th>
                <SortHandler
                  sortField={'cashAmount'}
                  label={__('Cash Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'receivableAmount'}
                  label={__('Receivable Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'cardAmount'}
                  label={__('Card Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'mobileAmount'}
                  label={__('Mobile Amount')}
                />
              </th>
              <th>
                <SortHandler sortField={'totalAmount'} label={__('Amount')} />
              </th>
              <th>
                <SortHandler sortField={'customerId'} label={__('Customer')} />
              </th>
              <th>
                <SortHandler sortField={'posName'} label={__('Pos')} />
              </th>
              <th>
                <SortHandler sortField={'user'} label={__('User')} />
              </th>
              <th>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody id="works">
            {(works || []).map(work => (
              <Row
                work={work}
                key={work._id}
                history={history}
                onSyncErkhet={onSyncErkhet}
                onReturnBill={onReturnBill}
              />
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
        footer={<Pagination count={(summary || {}).count} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={(works || []).length}
            emptyText="Add in your first work!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(Orders);
