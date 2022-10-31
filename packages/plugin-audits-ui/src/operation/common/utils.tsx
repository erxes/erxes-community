import { SelectWithSearch } from '@erxes/ui/src';
import { IOption, IQueryParams } from '@erxes/ui/src/types';
import gql from 'graphql-tag';
import React from 'react';
import { queries as categoryQueries } from '../categories/graphql';
import { queries as operationQueries } from '../graphql';
import { IOperationCategories } from './types';

export const SelectWithOperationCategory = ({
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

  const generateCategoryOptions = (array: IOperationCategories[] = []): IOption[] => {
    let list: any[] = [];
    for (const item of array) {
      const category = item || ({} as IOperationCategories);
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
      queryName="auditOperationsCategories"
      name={name}
      initialValue={defaultValue}
      generateOptions={generateCategoryOptions}
      onSelect={onSelect}
      customQuery={categoryQueries.operationCategories}
      customOption={customOption ? customOption : { value: '', label: 'Choose a Category' }}
      multi={multi}
    />
  );
};

export const subOption = category => {
  const { order } = category;
  const foundedString = order.match(/[/]/gi);
  return '\u00A0 '.repeat(foundedString.length);
};

export const refetchQueries = queryParams => [
  {
    query: gql(categoryQueries.operationCategories)
  },
  {
    query: gql(operationQueries.operations)
  }
];
