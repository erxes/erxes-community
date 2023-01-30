import React from 'react';
import { IReport, IUserReport } from '../../types';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  displayType: string;
  report: IReport;
};

const ReportRow = (userReport: IUserReport) => {
  return (
    <tr key={Math.random()}>
      <td>{userReport.user.employeeId}</td>
      <td>{userReport.user.details?.lastName || '-'}</td>
      <td>{userReport.user.details?.firstName || '-'}</td>
      <td>{'-'}</td>
      <td>{userReport.user.details?.position || '-'}</td>
      <td>{userReport.totalDaysScheduled}</td>
      <td>{userReport.totalDaysWorked}</td>
      <td>{'-'}</td>
    </tr>
  );
};

const ReportList = (props: Props) => {
  const { report, displayType } = props;
  return (
    <tbody>{report.groupReport.map(userReport => ReportRow(userReport))}</tbody>
  );
};

export default ReportList;
