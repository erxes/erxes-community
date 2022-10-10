import { IProductCategory } from '@erxes/ui-products/src/types';
import ErrorMsg from '@erxes/ui/src/components/ErrorMsg';
import Spinner from '@erxes/ui/src/components/Spinner';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import { queries } from '../../graphql';

import SelectCategory from '../../components/productCategory/SelectProductCategory';

type Props = {
  defaultValue?: string;
  onChange: (value: string) => void;
};

const SelectCategoryContainer = (props: Props) => {
  const { data, loading, error } = useQuery(gql(queries.productCategories));

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  const productCategories: IProductCategory[] =
    (data && data.productCategories) || [];

  return <SelectCategory {...props} productCategories={productCategories} />;
};

export default SelectCategoryContainer;
