/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react"
import {
  DocumentNode,
  WatchQueryFetchPolicy,
  gql,
  useLazyQuery,
} from "@apollo/client"

import { IOrder, IOrderStatus } from "@/types/order.types"

import { queries, subscriptions } from "../graphql"

const checkIsArray = (statuses: IOrderStatus[]) =>
  Array.isArray(statuses) ? statuses : [statuses]

interface IVariables {
  searchValue?: string | null
  statuses?: IOrderStatus[]
  customerId?: string | null
  startDate?: string | null
  endDate?: string | null
  isPaid?: null | boolean
  perPage?: number
  page?: number
  sortField?: string | null
  sortDirection?: number | null
}

interface IFullOrdersResult {
  loading: boolean
  fullOrders: IOrder[]
  subToOrderStatuses: (subStatuses: IOrderStatus[], callBack?: any) => void // Replace 'any' with the appropriate type for callBack
  refetch: () => void
  subToItems: (subStatuses: IOrderStatus[], callBack?: any) => void // Replace 'any' with the appropriate type for callBack
  totalCount: number
  handleLoadMore: () => void
}

const useFullOrders = ({
  fetchPolicy = "network-only",
  query,
  variables,
}: {
  fetchPolicy?: WatchQueryFetchPolicy
  query?: DocumentNode
  variables?: IVariables
}): IFullOrdersResult => {
  const PER_PAGE = (variables || {}).perPage || 28

  const [
    getFullOrders,
    { loading, data, subscribeToMore, refetch, fetchMore },
  ] = useLazyQuery(query ? query : queries.fullOrders, {
    variables: {
      page: 1,
      ...variables,
      perPage: PER_PAGE,
    },
    fetchPolicy,
  })

  const [getOrdersTotalCount, { loading: loadCount, data: countData }] =
    useLazyQuery(queries.ordersTotalCount, {
      variables,
      fetchPolicy,
    })

  const fullOrders = (data || {}).fullOrders || []
  const totalCount = (countData || {}).ordersTotalCount || 0

  const subToOrderStatuses = useCallback(
    (subStatuses: IOrderStatus[], callBack?: any) =>
      subscribeToMore({
        document: gql(subscriptions.ordersOrdered),
        variables: { statuses: checkIsArray(subStatuses) },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const changedOrder = subscriptionData.data.ordersOrdered
          if (changedOrder) {
            refetch()
            callBack && callBack()
          }
          return prev
        },
      }),
    [refetch, subscribeToMore]
  )

  const subToItems = useCallback(
    (subStatuses: IOrderStatus[], callBack?: any) =>
      subscribeToMore({
        document: gql(subscriptions.orderItemsOrdered),
        variables: { statuses: checkIsArray(subStatuses) },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const changedOrderItem = subscriptionData.data.orderItemsOrdered
          if (changedOrderItem) {
            refetch()
            callBack && callBack()
          }
        },
      }),
    [refetch, subscribeToMore]
  )

  const handleLoadMore = useCallback(() => {
    if (totalCount > fullOrders.length) {
      fetchMore({
        variables: {
          page: Math.ceil(fullOrders.length / PER_PAGE) + 1,
          perPage: PER_PAGE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return Object.assign({}, prev, {
            fullOrders: [
              ...(prev.fullOrders || []),
              ...fetchMoreResult.fullOrders,
            ],
          })
        },
      })
    }
  }, [PER_PAGE, fetchMore, fullOrders.length, totalCount])

  useEffect(() => {
    getFullOrders()
    getOrdersTotalCount()
  }, [])

  return {
    loading: loading || loadCount,
    fullOrders,
    subToOrderStatuses,
    refetch,
    subToItems,
    totalCount,
    handleLoadMore,
  }
}

export default useFullOrders
