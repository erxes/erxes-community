import { useEffect } from "react"
import { activeOrderAtom, setOrderStatesAtom } from "@/store/order.store"
import { DocumentNode, useLazyQuery } from "@apollo/client"
import { useAtom } from "jotai"

import { IOrder } from "@/types/order.types"

import { queries } from "../graphql"

const useOrderDetail = (args?: {
  query?: DocumentNode
  onCompleted?: (data: any) => void
}): {
  loading: boolean
  orderDetail?: IOrder
} => {
  const { query, onCompleted } = args || {}

  const [activeOrderId] = useAtom(activeOrderAtom)
  const [, setOrderStates] = useAtom(setOrderStatesAtom)

  const [getOrderDetail, { data, loading }] = useLazyQuery(
    query || queries.orderDetail,
    {
      fetchPolicy: "network-only",
      onCompleted(data: { orderDetail?: IOrder }) {
        const { orderDetail } = data || {}
        if (!query && !onCompleted)
          return !!orderDetail && setOrderStates(orderDetail)
        if (!!onCompleted) return onCompleted(orderDetail)
      },
    }
  )

  useEffect(() => {
    !!activeOrderId &&
      getOrderDetail({
        variables: { _id: activeOrderId },
      })
  }, [activeOrderId, getOrderDetail])

  const { orderDetail } = data || {}
  return { loading, orderDetail }
}

export default useOrderDetail
