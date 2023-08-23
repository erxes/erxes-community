"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useOrderCU from "@/modules/orders/hooks/useOrderCU"
import { activeOrderAtom } from "@/store/order.store"
import { useAtom } from "jotai"

import { Button } from "@/components/ui/button"

const BuyAction = () => {
  const [goToPayment, setGoToPayment] = useState(false)
  const [, setActiveOrder] = useAtom(activeOrderAtom)
  const router = useRouter()
  const onCompleted = (_id: string) => {
    goToPayment && router.push("/checkout?orderId=" + _id)
    return setActiveOrder(_id)
  }

  const { loading, orderCU, variables } = useOrderCU(onCompleted)

  const disabled = loading || variables.items.length === 0

  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          setGoToPayment(false)
          orderCU()
        }}
        loading={loading && !goToPayment}
        disabled={disabled}
      >
        Захиалах
      </Button>
      <Button
        size="lg"
        className="col-span-2 bg-green-500 hover:bg-green-500/90"
        loading={loading && goToPayment}
        disabled={disabled}
        onClick={() => {
          setGoToPayment(true)
          orderCU()
        }}
      >
        Төлбөр төлөх
      </Button>
    </>
  )
}

export default BuyAction
