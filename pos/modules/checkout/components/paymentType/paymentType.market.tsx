import { ChangeEvent, useEffect, useState } from "react"
import dynamic, { DynamicOptions } from "next/dynamic"
import useAddPayment from "@/modules/checkout/hooks/useAddPayment"
import { currentAmountAtom, currentPaymentTypeAtom } from "@/store"
import { totalAmountAtom } from "@/store/cart.store"
import {
  activeOrderAtom,
  getTotalPaidAmountAtom,
  unPaidAmountAtom,
} from "@/store/order.store"
import { paymentSheetAtom } from "@/store/ui.store"
import { useAtom } from "jotai"
import { CheckIcon, Loader2Icon } from "lucide-react"

import { ALL_BANK_CARD_TYPES, BANK_CARD_TYPES } from "@/lib/constants"
import { cn, paidAmounts } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { useCheckNotSplit } from "../../hooks/usePaymentType"
import SelectPaymentType from "./selectPaymentType.market"

const PaymentType = () => {
  const [_id] = useAtom(activeOrderAtom)
  const [type] = useAtom(currentPaymentTypeAtom)
  const [openSheet, setOpenSheet] = useAtom(paymentSheetAtom)
  const { addPayment, loading } = useAddPayment()
  const [notPaidAmount] = useAtom(unPaidAmountAtom)
  const [currentAmount, setCurrentAmount] = useAtom(currentAmountAtom)
  const { handleSetType, disableInput } = useCheckNotSplit()

  useEffect(() => {
    notPaidAmount > 0 && setCurrentAmount(notPaidAmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notPaidAmount])

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setCurrentAmount(
      value > notPaidAmount ? (type === "cash" ? value : notPaidAmount) : value
    )
  }

  const handleClick = () => {
    if (type === "mobile" || ALL_BANK_CARD_TYPES.includes(type)) {
      return setOpenSheet(true)
    }
    if (type === "cash") {
      if (currentAmount > notPaidAmount) {
        return setOpenSheet(true)
      }
      return addPayment({
        variables: {
          _id,
          cashAmount: currentAmount,
        },
      })
    }

    if (type) {
      addPayment({
        variables: {
          _id,
          paidAmounts: paidAmounts(type, currentAmount),
        },
      })
    }
  }

  if (notPaidAmount > 0)
    return (
      <div className="mb-2 flex items-center">
        <div className="flex flex-auto">
          <div className="w-1/2 pr-1">
            <SelectPaymentType value={type} onValueChange={handleSetType} />
          </div>
          <div className="w-1/2 pl-1">
            <Input
              value={currentAmount}
              type="number"
              disabled={disableInput || loading}
              onChange={handleValueChange}
            />
          </div>
        </div>
        <Button
          className={cn(submitClassName, "bg-green-500 hover:bg-green-500/90")}
          loading={loading}
          iconOnly={true}
          onClick={handleClick}
        >
          <CheckIcon className=" h-4 w-4" />
        </Button>
        <Sheet
          open={openSheet}
          onOpenChange={() =>
            !ALL_BANK_CARD_TYPES.includes(type) && setOpenSheet(false)
          }
        >
          <SheetContent
            className={cn("flex flex-col", type === "mobile" && "sm:max-w-3xl")}
          >
            {openSheet && (
              <>
                {type === "cash" && <CashSheet />}
                {type === "mobile" && <MobileSheet />}
                {type === BANK_CARD_TYPES.KHANBANK && <KhanSheet />}
                {type === BANK_CARD_TYPES.TDB && <TDBSheet />}
                {type === BANK_CARD_TYPES.GOLOMT && <GolomtSheet />}
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    )
  return null
}

export const submitClassName = "ml-2 h-auto flex-none rounded-full p-0.5"

const Loading = () => (
  <div className="flex flex-auto items-center justify-center">
    <Loader2Icon className="mr-3 h-7 w-7 animate-spin" strokeWidth={1.2} />
    Уншиж байна
  </div>
)

const CashSheet = dynamic(() => import("../paymentTypes/cashSheet.market"), {
  loading: Loading,
})
const MobileSheet = dynamic(
  () => import("../paymentTypes/mobileSheet.market"),
  {
    loading: Loading,
  }
)
const KhanSheet = dynamic(() => import("../paymentTypes/khanCardSheet"), {
  loading: Loading,
})

const TDBSheet = dynamic(() => import("../paymentTypes/TDBCardSheet"), {
  loading: Loading,
})

const GolomtSheet = dynamic(() => import("../paymentTypes/golomtSheet"), {
  loading: Loading,
})

export default PaymentType
