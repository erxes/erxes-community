import {
  ContentColumn,
  ItemRow,
  ItemText
} from '@erxes/ui-cards/src/deals/styles';
import {
  ControlLabel,
  DataWithLoader,
  FormGroup,
  Pagination,
  router,
  SelectWithSearch,
  Spinner,
  Wrapper,
  __
} from '@erxes/ui/src';
import { IOption, IQueryParams } from '@erxes/ui/src/types';
import React from 'react';
import gql from 'graphql-tag';

export const refetchQueries = queryParams => {
  return [
    {
      query: gql(movementQueries.movementsTotalCount),
      variables: {
        ...generateParams({ queryParams })
      }
    }
  ];
};

export const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  createdAtFrom: queryParams.createdAtFrom,
  createdAtTo: queryParams.createdAtTo
});
