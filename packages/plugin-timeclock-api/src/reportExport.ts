import dayjs = require('dayjs');
import * as moment from 'moment';
import * as xlsxPopulate from 'xlsx-populate';
import { IModels } from './connectionResolver';
import { PRELIMINARY_REPORT_COLUMNS } from './constants';
import { timeclockReportPreliminary } from './graphql/resolvers/utils';
import { IUserReport } from './models/definitions/timeclock';
import { createTeamMembersObject, generateCommonUserIds } from './utils';

const dateFormat = 'YYYY-MM-DD';
/**
 * Creates blank workbook
 */
export const createXlsFile = async () => {
  // Generating blank workbook
  const workbook = await xlsxPopulate.fromBlankAsync();

  return { workbook, sheet: workbook.sheet(0) };
};

/**
 * Generates downloadable xls file on the url
 */
export const generateXlsx = async (workbook: any): Promise<string> => {
  return workbook.outputAsync();
};

const addIntoSheet = async (
  values: string[][],
  startRowIdx: number,
  endRowIdx: number,
  sheet: any,
  reportType: string
) => {
  let r;
  switch (reportType) {
    case 'Урьдчилсан' || 'Preliminary':
      // A to I
      r = sheet.range(`A${startRowIdx}:I${endRowIdx}`);
      break;
    case 'Сүүлд' || 'Final':
    case 'Pivot':
  }
  r.value(values);
};

const prepareHeader = async (sheet: any, reportType: string) => {
  switch (reportType) {
    case 'Урьдчилсан' || 'Preliminary':
      const table_headers = PRELIMINARY_REPORT_COLUMNS;
      // A to I
      addIntoSheet([table_headers], 1, 1, sheet, reportType);

    case 'Сүүлд' || 'Final':
    case 'Pivot':
  }
};
export const buildFile = async (
  models: IModels,
  subdomain: string,
  query: any
) => {
  const reportType = query.reportType;
  const userIds =
    query.userIds instanceof Array || !query.userIds
      ? query.userIds
      : [query.userIds];

  const branchIds =
    query.branchIds instanceof Array || !query.branchIds
      ? query.branchIds
      : [query.branchIds];
  const departmentIds =
    query.departmentIds instanceof Array || !query.departmentIds
      ? query.departmentIds
      : [query.departmentIds];

  const startDate = query.startDate;
  const endDate = query.endDate;

  const startDateFormatted = dayjs(startDate).format(dateFormat);
  const endDateFormatted = dayjs(endDate).format(dateFormat);

  const { workbook, sheet } = await createXlsFile();

  const teamMembersObject = await createTeamMembersObject(subdomain);

  const teamMemberIds = Object.keys(teamMembersObject);

  const teamMemberIdsFromFilter = await generateCommonUserIds(
    subdomain,
    userIds,
    branchIds,
    departmentIds
  );

  const totalTeamMemberIds = teamMemberIdsFromFilter.length
    ? teamMemberIdsFromFilter
    : teamMemberIds;

  const startRowIdx = 2;
  const endRowIdx = teamMemberIds.length + 1;

  let report;

  prepareHeader(sheet, reportType);

  switch (reportType) {
    case 'Урьдчилсан' || 'Preliminary':
      report = await timeclockReportPreliminary(
        subdomain,
        totalTeamMemberIds,
        startDate,
        endDate,
        teamMembersObject,
        true
      );
      break;

    case 'Сүүлд' || 'Final':
    case 'Pivot':
  }

  const extractValuesFromEmpReportObjects = (empReports: IUserReport[]) => {
    const extractValuesIntoArr: any[][] = [];
    let rowNum = 1;

    for (const empReport of empReports) {
      extractValuesIntoArr.push([rowNum, ...Object.values(empReport)]);
      rowNum += 1;
    }

    return extractValuesIntoArr;
  };

  const extractAllData = extractValuesFromEmpReportObjects(
    Object.values(report)
  );

  addIntoSheet(extractAllData, startRowIdx, endRowIdx, sheet, reportType);

  return {
    name: `${reportType}-${startDateFormatted}-${endDateFormatted}`,
    response: await generateXlsx(workbook)
  };
};
