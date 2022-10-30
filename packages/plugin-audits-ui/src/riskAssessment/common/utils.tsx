import React from 'react';
import { __, ControlLabel, SelectWithSearch } from '@erxes/ui/src';
import { CustomFormGroupProps, RiskAssessmentCategory } from './types';
import { FormGroupRow } from '../../styles';
import { IOption, IQueryParams } from '@erxes/ui/src/types';
import { queries as categoryQueries } from '../categories/graphql';

export const CustomFormGroup = ({
  children,
  label,
  required,
  row,
  spaceBetween
}: CustomFormGroupProps) => {
  return (
    <FormGroupRow horizontal={row} spaceBetween={spaceBetween}>
      <ControlLabel required={required}>{label}</ControlLabel>
      {children}
    </FormGroupRow>
  );
};

export const subOption = category => {
  const { order } = category;
  const foundedString = order.match(/[/]/gi);
  return '\u00A0 '.repeat(foundedString.length);
};

export const SelectWithCategory = ({
  label,
  name,
  queryParams,
  initialValue,
  multi,
  customOption,
  skip,
  onSelect
}: {
  queryParams?: IQueryParams;
  label: string;
  onSelect: (value: string[] | string, name: string) => void;
  multi?: boolean;
  customOption?: IOption;
  initialValue?: string | string[];
  name: string;
  skip?: string[];
}) => {
  const defaultValue = queryParams ? queryParams[name] : initialValue;

  const generateCategoryOptions = (array: RiskAssessmentCategory[] = []): IOption[] => {
    let list: any[] = [];
    for (const item of array) {
      const category = item || ({} as RiskAssessmentCategory);
      const order = category.order;
      const foundedString = order?.match(/[/]/gi);

      let space = '';
      if (foundedString) {
        space = '\u00A0 '.repeat(foundedString.length);
      }

      list.push({ label: `${space} ${category.name}`, value: category._id });
    }

    if (skip) {
      list = list.filter(item => item.value !== skip);
    }
    return list;
  };

  return (
    <SelectWithSearch
      label={label}
      queryName="riskAssesmentCategories"
      name={name}
      initialValue={defaultValue}
      generateOptions={generateCategoryOptions}
      onSelect={onSelect}
      customQuery={categoryQueries.listAssessmentCategories}
      customOption={customOption ? customOption : { value: '', label: 'Choose a Category' }}
      multi={multi}
    />
  );
};
