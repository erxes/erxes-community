import { ContentColumn, ItemRow, ItemText } from '@erxes/ui-cards/src/deals/styles';
import {
  ControlLabel,
  DataWithLoader,
  FormGroup,
  Pagination,
  Spinner,
  Wrapper,
  __,
  router,
  SelectWithSearch
} from '@erxes/ui/src';
import React from 'react';
import { ASSET_GROUP_STATUS_FILTER, ASSET_TYPE_CHOISES } from './constant';
import { CommonFormGroupTypes, IAsset, IAssetGroupTypes } from './types';
import { queries as assetQueries } from '../asset/graphql';
import { IOption, IQueryParams } from '@erxes/ui/src/types';

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
          emptyText={__('No data')}
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

export const CommonItemRow = ({ children, label }) => {
  return (
    <ItemRow>
      <ItemText>{__(label)}</ItemText>
      <ContentColumn flex="4">{children}</ContentColumn>
    </ItemRow>
  );
};

export const generateGroupOptions = (
  groups: IAssetGroupTypes[],
  currentGroupId?: string,
  drawCode?: boolean
) => {
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

export const generateParentOptions = (
  assets: IAsset[],
  currentAssetId?: string,
  drawCode?: boolean
) => {
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
  movedAtFrom: queryParams.movedAtFrom,
  movedAtTo: queryParams.movedAtTo,
  createdAtFrom: queryParams.createdAtFrom,
  createdAtTo: queryParams.createdAtTo,
  userId: queryParams.userId,
  branchId: queryParams?.branchId,
  departmentId: queryParams?.departmentId,
  teamMemberId: queryParams?.teamMemberId,
  companyId: queryParams?.companyId,
  customerId: queryParams?.customerId,
  assetId: queryParams?.assetId,
  searchValue: queryParams?.searchValue
});

export const SelectWithAssets = ({
  label,
  name,
  queryParams,
  initialValue,
  multi,
  customOption,
  onSelect
}: {
  queryParams?: IQueryParams;
  label: string;
  onSelect: (value: string[] | string, name: string) => void;
  multi?: boolean;
  customOption?: IOption;
  initialValue?: string | string[];
  name: string;
}) => {
  const defaultValue = queryParams ? queryParams[name] : initialValue;

  const generateAssetOptions = (array: IAsset[] = []): IOption[] => {
    return array.map(item => {
      const asset = item || ({} as IAsset);
      return {
        value: asset._id,
        label: item.name
      };
    });
  };

  return (
    <SelectWithSearch
      label={label}
      queryName="assets"
      name={name}
      initialValue={defaultValue}
      generateOptions={generateAssetOptions}
      onSelect={onSelect}
      customQuery={assetQueries.assets}
      customOption={customOption}
      multi={multi}
    />
  );
};
