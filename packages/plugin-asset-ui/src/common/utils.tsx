import { ControlLabel, DataWithLoader, FormGroup, Pagination, Spinner, Wrapper, __, router } from '@erxes/ui/src';
import React from 'react';
import { ASSET_GROUP_STATUS_FILTER, ASSET_TYPE_CHOISES } from './constant';
import { CommonFormGroupTypes, IAsset, IAssetGroupTypes } from './types';

export const DefaultWrapper = ({
  title,
  rightActionBar,
  leftActionBar,
  loading,
  totalCount,
  content,
  sidebar,
  isPaginationHide,
  breadcrumb,
  subMenu
}: {
  title: string;
  rightActionBar?: JSX.Element;
  leftActionBar?: JSX.Element;
  loading?: boolean;
  totalCount?: number;
  content: JSX.Element;
  sidebar?: JSX.Element;
  isPaginationHide?: boolean;
  breadcrumb?: any[];
  subMenu?: { title: string; link: string }[];
}) => {
  if (loading) {
    return <Spinner objective />;
  }
  return (
    <Wrapper
      header={<Wrapper.Header title={title} submenu={subMenu} breadcrumb={breadcrumb} />}
      actionBar={<Wrapper.ActionBar left={leftActionBar} right={rightActionBar} />}
      content={
        <DataWithLoader
          loading={loading || false}
          data={content}
          count={totalCount}
          emptyImage="/images/actions/5.svg"
          emptyText={__('No data of risk assessment')}
        />
      }
      leftSidebar={sidebar}
      footer={!isPaginationHide && <Pagination count={totalCount} />}
    />
  );
};

export const CommonFormGroup = ({ children, label, required }: CommonFormGroupTypes) => {
  return (
    <FormGroup>
      <ControlLabel required={required}>{label}</ControlLabel>
      {children}
    </FormGroup>
  );
};

export const generateGroupOptions = (groups: IAssetGroupTypes[], currentGroupId?: string, drawCode?: boolean) => {
  const result: React.ReactNode[] = [];

  for (const group of groups) {
    const order = group.order;

    const foundedString = order.match(/[/]/gi);

    let space = '';

    if (foundedString) {
      space = '\u00A0 '.repeat(foundedString.length);
    }

    if (currentGroupId !== group._id) {
      result.push(
        <option key={group._id} value={group._id}>
          {space}
          {drawCode ? `${group.code} - ` : ''}
          {group.name}
        </option>
      );
    }
  }

  return result;
};

export const generateParentOptions = (assets: IAsset[], currentAssetId?: string, drawCode?: boolean) => {
  const result: React.ReactNode[] = [];
  for (const asset of assets) {
    const order = asset.order;

    const foundedString = order.match(/[/]/gi);

    let space = '';

    if (foundedString) {
      space = '\u00A0 '.repeat(foundedString.length);
    }
    if (currentAssetId !== asset._id) {
      result.push(
        <option key={asset._id} value={asset._id}>
          {space}
          {drawCode ? `${asset.code} - ` : ''}
          {asset.name}
        </option>
      );
    }
  }
  return result;
};

export const assetStatusChoises = __ => {
  const options: Array<{ value: string; label: string }> = [];

  for (const key of Object.keys(ASSET_GROUP_STATUS_FILTER)) {
    options.push({
      value: key,
      label: __(ASSET_GROUP_STATUS_FILTER[key])
    });
  }

  return options;
};

export const asssetTypeChoises = __ => {
  const options: Array<{ value: string; label: string }> = [];

  for (const key of Object.keys(ASSET_TYPE_CHOISES)) {
    options.push({
      value: key,
      label: __(ASSET_TYPE_CHOISES[key])
    });
  }

  return options;
};

export const getRefetchQueries = () => {
  return ['assetDetail', 'assets', 'assetsTotalCount', 'assetGroups'];
};

export const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  movementId: queryParams?.movementId,
  from: queryParams.from,
  to: queryParams.to,
  branchId: queryParams?.branchId,
  departmentId: queryParams?.departmentId,
  teamMemberId: queryParams?.teamMemberId,
  companyId: queryParams?.companyId,
  customerId: queryParams?.customerId,
  searchValue: queryParams?.searchValue
});
