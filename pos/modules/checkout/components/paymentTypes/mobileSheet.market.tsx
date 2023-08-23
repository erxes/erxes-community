import useAddPayment from "@/modules/checkout/hooks/useAddPayment"
import useMobilePayment from "@/modules/checkout/hooks/useMobilePayment"
import { currentAmountAtom } from "@/store"
import { activeOrderAtom } from "@/store/order.store"
import { paymentSheetAtom } from "@/store/ui.store"
import { useAtom } from "jotai"
import { Loader2Icon } from "lucide-react"

const MobileSheet = () => {
  const [currentAmount] = useAtom(currentAmountAtom)
  const [_id] = useAtom(activeOrderAtom)
  const [, setOpenSheet] = useAtom(paymentSheetAtom)

  // description

  const { addPayment, loading: loadingAdd } = useAddPayment()
  const { invoiceUrl, loading } = useMobilePayment({
    amount: currentAmount,
    onCompleted: (paidAmount) => {
      addPayment({
        variables: {
          _id,
          mobileAmount: paidAmount,
        },
        onCompleted: () => setOpenSheet(false),
      })
    },
  })

  if (loading || loadingAdd)
    return (
      <div className="flex flex-auto items-center justify-center">
        <Loader2Icon className="mr-1 h-5 w-5 animate-spin" /> Уншиж байна...
      </div>
    )

  if (!invoiceUrl) return <div></div>

  return <iframe src={invoiceUrl} className="min-h-full" />
}

export default MobileSheet
