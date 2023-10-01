import { useEffect } from "react"
import { currentAmountAtom } from "@/store"
import { unPaidAmountAtom } from "@/store/order.store"
import { paymentSheetAtom } from "@/store/ui.store"
import { useAtomValue, useSetAtom } from "jotai"

const HandleNotPaidAmount = () => {
  const notPaidAmount = useAtomValue(unPaidAmountAtom)
  const setCurrentAmount = useSetAtom(currentAmountAtom)
  const changeOpen = useSetAtom(paymentSheetAtom)

  useEffect(() => {
    setCurrentAmount(notPaidAmount)
    changeOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notPaidAmount])

  return null
}

export default HandleNotPaidAmount
