import useGolomt from "@/modules/checkout/hooks/useGolomt"
import useKhanCard from "@/modules/checkout/hooks/useKhanCard"
import useTDB from "@/modules/checkout/hooks/useTDB"
import { paymentConfigAtom } from "@/store/config.store"
import { SelectProps } from "@radix-ui/react-select"
import { useAtom } from "jotai"

import { BANK_CARD_TYPES } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useCheckNotSplit } from "../../hooks/usePaymentType"

const SelectPaymentType = ({ disabled, ...props }: SelectProps) => {
  const [config] = useAtom(paymentConfigAtom)
  const { paymentIds } = config || {}
  const { loading, isAlive } = useKhanCard({skipCheck: true})
  const { paymentType: tdbInfo } = useTDB()
  const { isIncluded } = useGolomt()
  const { mappedPts, paidNotSplit } = useCheckNotSplit()

  const disabledItems = !!paidNotSplit

  return (
    <Select {...props} disabled={loading || disabled}>
      <SelectTrigger>
        <SelectValue placeholder="сонгох" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="cash" disabled={disabledItems}>
            Бэлнээр
          </SelectItem>
          {!!paymentIds?.length && (
            <SelectItem value="mobile" disabled={disabledItems}>
              Цахимаар
            </SelectItem>
          )}

          {isAlive && (
            <SelectItem
              value={BANK_CARD_TYPES.KHANBANK}
              disabled={disabledItems}
            >
              Хаан банк
            </SelectItem>
          )}
          {!!tdbInfo && (
            <SelectItem value={BANK_CARD_TYPES.TDB} disabled={disabledItems}>
              ХXБанк
            </SelectItem>
          )}
          {isIncluded && (
            <SelectItem value={BANK_CARD_TYPES.GOLOMT} disabled={disabledItems}>
              Голомт банк
            </SelectItem>
          )}
          {mappedPts.map((payment) => (
            <SelectItem value={payment.type} disabled={payment.disabled}>
              {payment.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectPaymentType
