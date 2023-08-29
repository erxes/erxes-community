import { currentAmountAtom, currentPaymentTypeAtom } from "@/store"
import { useAtom, useSetAtom } from "jotai"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Keys from "@/app/(main)/checkout/components/Keys"

const PaymentType = () => {
  const setPaymentTerm = useSetAtom(currentPaymentTypeAtom)
  const [amount, setAmount] = useAtom(currentAmountAtom)

  return (
    <div>
      <div className="flex justify-between items-center p-1 border-b border-slate-500 pb-2 mb-4">
        <div className="flex-auto">
          <div className="flex items-center text-3xl font-black mb-2">
            <div className="translate-y-[1px]">₮</div>
            <Input
              className="border-none px-2 "
              focus={false}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <span className="text-slate-300">Үлдэгдэл: ₮</span>
        </div>
        <div className="flex-auto flex items-center gap-1">
          <Button className="bg-green-500 hover:bg-green-500/90 whitespace-nowrap font-bold">
            Гүйлгээ хийх
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-2 h-8 hover:bg-slate-900 hover:text-white"
            onClick={() => setPaymentTerm("")}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Keys />
    </div>
  )
}

export default PaymentType
