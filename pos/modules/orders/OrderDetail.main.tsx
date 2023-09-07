
import { OperationVariables } from "@apollo/client"
import { Loader2Icon } from "lucide-react"

import useOrderDetail from "./hooks/useOrderDetail"
import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { setOrderStatesAtom } from '@/store/order.store'

const OrderDetail = ({
  children,
  variables,
}: {
  children: any
  variables?: OperationVariables
}) => {
  const setOrderStates = useSetAtom(setOrderStatesAtom)
  const { loading, orderDetail } = useOrderDetail({ variables: variables, onCompleted: () => null })

  useEffect(() => {
    orderDetail && setOrderStates(orderDetail)
  }, [orderDetail, setOrderStates]);

  if (loading)
    return (
      <div className="flex flex-auto items-center justify-center">
        <Loader2Icon className="mr-3 h-5 w-5 animate-spin" />
        Уншиж байна...
      </div>
    )
  return children
}

export default OrderDetail
