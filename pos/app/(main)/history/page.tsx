"use client"

import { useState } from "react"
import { queries } from "@/modules/orders/graphql"
import useFullOrders from "@/modules/orders/hooks/useFullOrders"
import { filterAtom } from "@/store/history.store"
import { useAtom } from "jotai"

import { IOrderHistory } from "@/types/order.types"
import { ScrollArea } from "@/components/ui/scroll-area"

import Filter from "./components/filter"
import Pagination from "./components/pagination"
import HistoryTable from "./components/table"

const History = () => {
  const [filter, setFilter] = useAtom(filterAtom)

  const { loading, fullOrders, totalCount } = useFullOrders({
    query: queries.ordersHistory,
    variables: filter,
  })

  return (
    <ScrollArea className="h-full max-h-full">
      <Filter />
      <HistoryTable
        orders={(fullOrders || []) as IOrderHistory[]}
        loading={loading}
      />
      <Pagination totalCount={totalCount} />
    </ScrollArea>
  )
}

export default History
