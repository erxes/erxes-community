import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import queryString from 'query-string';
import gql from 'graphql-tag';
// erxes
import Alert from '@erxes/ui/src/utils/Alert';
// local
import { queries, mutations } from '../graphql';
import ListComponent from '../components/List';

type Props = {
  id: string;
};

export default function ListContainer(props: Props) {
  const { id } = props;
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  /**
   * Queries
   */
  const safeRemainderDetailQuery = useQuery(gql(queries.safeRemainderDetail), {
    notifyOnNetworkStatusChange: true,
    variables: { _id: id }
  });
  const safeRemainderItemsQuery = useQuery(gql(queries.safeRemainderItems), {
    fetchPolicy: 'network-only',
    variables: {
      remainderId: id,
      status: queryParams.status,
      diffType: queryParams.diffType,
      productCategoryId: queryParams.productCategoryId
    }
  });
  const safeRemainderItemsCountQuery = useQuery(
    gql(queries.safeRemainderItemsCount),
    {
      fetchPolicy: 'network-only',
      variables: {
        remainderId: id,
        status: queryParams.status,
        diffType: queryParams.diffType,
        productCategoryId: queryParams.productCategoryId
      }
    }
  );

  /**
   * Mutations
   */
  const [transactionAdd] = useMutation(gql(mutations.transactionAdd), {
    refetchQueries: ['safeRemainderItemsQuery']
  });
  const [safeRemainderItemEdit] = useMutation(
    gql(mutations.safeRemainderItemEdit),
    {
      refetchQueries: ['safeRemainderItemsQuery']
    }
  );
  const [safeRemainderItemRemove] = useMutation(
    gql(mutations.safeRemainderItemRemove),
    {
      refetchQueries: ['safeRemainderItemsQuery']
    }
  );

  /**
   * Methods
   */
  const updateItem = (_id: string, remainder: number, status?: string) => {
    safeRemainderItemEdit({ variables: { _id, remainder, status } })
      .then(() => {
        Alert.success('You successfully updated a census');
        safeRemainderItemsQuery.refetch();
      })
      .catch((error: any) => Alert.error(error.message));
  };

  const removeItem = (item: any) => {
    safeRemainderItemRemove({ variables: { _id: item._id } })
      .then(() => {
        Alert.success('You successfully updated a census');
        safeRemainderItemsQuery.refetch();
      })
      .catch((error: any) => Alert.error(error.message));
  };

  const createTransaction = (data: any) => {
    let products: any = [];

    data.map((item: any) => {
      products.push({
        productId: item.productId,
        count: item.count,
        uomId: item.uomId,
        isDebit: true
      });
    });

    transactionAdd({
      variables: {
        branchId: safeRemainder.branchId,
        departmentId: safeRemainder.departmentId,
        contentType: 'safe remainder',
        contentId: 'safe_remainder_id',
        status: 'checked',
        products: products
      }
    })
      .then(() => {
        Alert.success('Success!');
        safeRemainderItemsQuery.refetch();
      })
      .catch((error: any) => {
        Alert.error(error.message);
      });
  };

  /**
   * Definitions
   */
  const safeRemainder =
    (safeRemainderDetailQuery.data &&
      safeRemainderDetailQuery.data.safeRemainderDetail) ||
    {};

  const safeRemainderItems =
    (safeRemainderItemsQuery.data &&
      safeRemainderItemsQuery.data.safeRemainderItems) ||
    [];

  const totalCount =
    (safeRemainderItemsCountQuery.data &&
      safeRemainderItemsCountQuery.data.safeRemainderItemsCount) ||
    0;

  const componentProps = {
    ...props,
    loading: safeRemainderItemsQuery.loading,
    safeRemainder,
    safeRemainderItems,
    totalCount,
    createTransaction,
    updateItem,
    removeItem
  };

  return <ListComponent {...componentProps} />;
}
