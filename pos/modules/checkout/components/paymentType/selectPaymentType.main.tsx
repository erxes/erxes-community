"use client"

import useConfig from "@/modules/auth/hooks/useConfig"
import {
  ChevronRight,
  CoinsIcon,
  LandmarkIcon,
  LucideIcon,
  SmartphoneNfcIcon,
  Wallet,
} from "lucide-react"

import { BANK_CARD_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"

import { useCheckNotSplit } from "../../hooks/usePaymentType"
import usePossiblePaymentTerms from "../../hooks/usePossiblePaymentTerms"

const SelectPaymentTypeMain = () => {
  const {
    loadingKhan,
    disabledTerms,
    paymentIds,
    khan,
    tdb,
    golomt,
    mappedPts,
  } = usePossiblePaymentTerms()

  const { loading } = useConfig("payment")

  if (loading) return <div className="h-24" />

  return (
    <div className="grid grid-cols-2 gap-2">
      <Term Icon={Wallet} title="Бэлнээр" type="cash" />
      {!!paymentIds?.length && (
        <Term Icon={SmartphoneNfcIcon} title="Цахимаар" type="mobile" />
      )}
      {khan && (
        <Term
          Icon={LandmarkIcon}
          title="Хаан банк"
          type={BANK_CARD_TYPES.KHANBANK}
        />
      )}
      {!!tdb && (
        <Term Icon={LandmarkIcon} title="ХX банк" type={BANK_CARD_TYPES.TDB} />
      )}
      {!!golomt && (
        <Term
          Icon={LandmarkIcon}
          title="Голомт банк"
          type={BANK_CARD_TYPES.GOLOMT}
        />
      )}
      {mappedPts.map((payment) => (
        <Term Icon={CoinsIcon} title={payment.title} type={payment.type} />
      ))}
    </div>
  )
}

const Term = ({
  Icon,
  title,
  type,
}: {
  Icon: LucideIcon
  title: string
  type: string
}) => {
  const { handleSetType } = useCheckNotSplit()

  return (
    <Button
      variant="secondary"
      className="flex items-center bg-transparent text-white p-4 font-semibold text-sm rounded-lg border border-slate-500 h-auto hover:bg-secondary/10 justify-between"
      onClick={() => handleSetType(type)}
    >
      <span className="flex items-center">
        <Icon className="mr-2" /> {title}
      </span>
      <ChevronRight className="h-5 w-5" />
    </Button>
  )
}

export default SelectPaymentTypeMain
