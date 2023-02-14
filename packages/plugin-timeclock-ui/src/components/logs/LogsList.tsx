import React from 'react';
import { ITimelog } from '../../types';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';

type Props = {
  queryParams: any;
  history: any;
  timelogs?: ITimelog[];
  totalCount?: number;

  showSideBar: (sideBar: boolean) => void;
  getActionBar: (actionBar: any) => void;
  getPagination: (pagination: any) => void;
};

function ReportList(props: Props) {
  const { totalCount, getPagination, showSideBar, getActionBar } = props;

  const actionBar = <div>asd</div>;

  const content = <div>asssss</div>;

  getPagination(<Pagination count={totalCount} />);
  showSideBar(true);
  getActionBar(actionBar);

  return content;
}

export default ReportList;
