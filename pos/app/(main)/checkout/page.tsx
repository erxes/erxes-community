"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import PaymentType from "@/modules/checkout/components/paymentType/paymentType.main"
import SelectPaymentTypeMain from "@/modules/checkout/components/paymentType/selectPaymentType.main"
import OrderDetail from "@/modules/orders/OrderDetail.main"
import { currentPaymentTypeAtom } from "@/store"
import { useAtomValue } from "jotai"

const Checkout = () => {
  const paymentTerm = useAtomValue(currentPaymentTypeAtom)
  const searchValue = useSearchParams()
  const _id = searchValue.get("orderId")

  const variables = useMemo(() => ({ _id }), [_id])

  return (
    <OrderDetail variables={variables}>
      <div className="flex max-h-screen min-h-[600px] w-auto min-w-[880px] flex-auto items-stretch">
        <div className="mr-4 w-7/12">
          <h2 className="text-sm font-semibold mb-3">
            {paymentTerm ? paymentTerm + ":" : "Төлбөрийн нөхцөлөө сонгоно уу."}
          </h2>
          {paymentTerm ? <PaymentType /> : <SelectPaymentTypeMain />}
        </div>
        <div className="w-5/12 rounded-3xl bg-white p-4 text-black">hey</div>
      </div>
    </OrderDetail>
  )
}

export default Checkout
