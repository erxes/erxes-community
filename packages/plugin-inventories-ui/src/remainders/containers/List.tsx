import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import queryString from 'query-string';
import gql from 'graphql-tag';
// erxes
import Bulk from '@erxes/ui/src/components/Bulk';
import Alert from '@erxes/ui/src/utils/Alert';
import * as router from '@erxes/ui/src/utils/router';
import { IQueryParams } from '@erxes/ui/src/types';
// local
import ListComponent from '../components/List';
import { queries, mutations } from '../graphql';
import { FILTER_PARAMS } from '../../constants';

export default function List() {
  const history = useHistory();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  // graphql
  const remainderProductsQuery: any = useQuery(gql(queries.remainderProducts), {
    variables: {
      ...router.generatePaginationParams(queryParams || {}),
      categoryId: queryParams.categoryId,
      searchValue: queryParams.searchValue,
      search: queryParams.search,
      departmentId: queryParams.departmentId,
      branchId: queryParams.branchId
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  const [remaindersUpdate] = useMutation(gql(mutations.remaindersUpdate), {
    refetchQueries: ['remainderProductsQuery']
  });

  const refetch = () => remainderProductsQuery.refetch();

  const handleSearch = (event: any) => {
    const searchValue = event.target.value;

    if (!searchValue) {
      return router.removeParams(history, 'search');
    }

    router.setParams(history, { searchValue });
  };

  const handleSelect = (values: string[] | string, key: string) => {
    if (queryParams[key] === values) {
      return router.removeParams(history, key);
    }

    return router.setParams(history, { [key]: values });
  };

  const handleFilter = (filterParams: IQueryParams) => {
    for (const key of Object.keys(filterParams)) {
      if (filterParams[key]) {
        router.setParams(history, { [key]: filterParams[key] });
      } else {
        router.removeParams(history, key);
      }
    }

    return router;
  };

  const isFiltered = (): boolean => {
    for (const param in queryParams) {
      if (FILTER_PARAMS.includes(param)) {
        return true;
      }
    }

    return false;
  };

  const clearFilter = () => {
    router.removeParams(history, ...Object.keys(queryParams));
  };

  const recalculate = (
    products: any[],
    departmentId: string,
    branchId: string,
    emptyBulk: () => void
  ) => {
    const productIds: string[] = [];

    products.forEach((product: any) => {
      productIds.push(product._id);
    });

    if (departmentId.length === 0) {
      Alert.error('Department is required!');
      return;
    }

    if (branchId.length === 0) {
      Alert.error('Branch is required!');
      return;
    }

    remaindersUpdate({
      variables: { productIds, departmentId, branchId }
    })
      .then((response: any) => {
        emptyBulk();
        refetch();
        Alert.success('Request successful!');
      })
      .catch((error: any) => Alert.error(error.message));
  };

  const products =
    (remainderProductsQuery.data &&
      remainderProductsQuery.data.remainderProducts.products) ||
    [];

  const totalCount =
    (remainderProductsQuery.data &&
      remainderProductsQuery.data.remainderProducts.totalCount) ||
    0;

  const searchValue = queryParams.searchValue || '';
  const departmentId = queryParams.departmentId || '';
  const branchId = queryParams.branchId || '';

  const updatedProps = {
    history,
    queryParams,
    products,
    totalCount,
    loading: remainderProductsQuery.loading,
    searchValue,
    departmentId,
    branchId,
    recalculate,
    handleFilter: handleFilter,
    handleSelect: handleSelect,
    handleSearch: handleSearch,
    isFiltered: isFiltered(),
    clearFilter: clearFilter
  };

  const renderContent = (props: any) => {
    return <ListComponent {...updatedProps} {...props} />;
  };

  return <Bulk content={renderContent} refetch={refetch} />;
}
