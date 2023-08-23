import {
  cashAmountAtom,
  mobileAmountAtom,
  paidAmountsAtom,
} from "@/store/order.store"
import { useAtom } from "jotai"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { submitClassName } from "./paymentType.market"
import SelectPaymentType from "./selectPaymentType.market"
import { mergePaidAmounts } from '@/lib/utils';

const PaidTypes = () => {
  const [cashAmount] = useAtom(cashAmountAtom)
  const [mobileAmount] = useAtom(mobileAmountAtom)
  const [paidAmounts] = useAtom(paidAmountsAtom)

  return (
    <>
      {!!cashAmount && <PaidType type="cash" amount={cashAmount} />}
      {!!mobileAmount && <PaidType type="mobile" amount={mobileAmount} />}
      {!!paidAmounts.length &&
        mergePaidAmounts(paidAmounts).map(({ amount, type }) => (
          <PaidType amount={amount} type={type} key={type} />
        ))}
    </>
  )
}

const PaidType = ({ type, amount }: { type: string; amount: number }) => {
  return (
    <div className="mb-2 flex items-center">
      <div className="flex flex-auto">
        <div className="w-1/2 pr-1">
          <SelectPaymentType disabled value={type} />
        </div>
        <div className="w-1/2 pl-1">
          <Input value={amount} type="number" disabled />
        </div>
      </div>
      <Button
        className={cn(submitClassName, "bg-amber-500 hover:bg-amber-500/90")}
        iconOnly={true}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default PaidTypes
