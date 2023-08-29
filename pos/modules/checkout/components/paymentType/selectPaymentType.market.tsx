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

import usePossiblePaymentTerms from "../../hooks/usePossiblePaymentTerms"

const SelectPaymentType = ({ disabled, ...props }: SelectProps) => {
  const {
    loadingKhan,
    disabledTerms,
    paymentIds,
    khan,
    tdb,
    golomt,
    mappedPts,
  } = usePossiblePaymentTerms()

  return (
    <Select {...props} disabled={loadingKhan || disabled}>
      <SelectTrigger>
        <SelectValue placeholder="сонгох" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="cash" disabled={disabledTerms}>
            Бэлнээр
          </SelectItem>
          {!!paymentIds?.length && (
            <SelectItem value="mobile" disabled={disabledTerms}>
              Цахимаар
            </SelectItem>
          )}

          {khan && (
            <SelectItem
              value={BANK_CARD_TYPES.KHANBANK}
              disabled={disabledTerms}
            >
              Хаан банк
            </SelectItem>
          )}
          {!!tdb && (
            <SelectItem value={BANK_CARD_TYPES.TDB} disabled={disabledTerms}>
              ХXБанк
            </SelectItem>
          )}
          {golomt && (
            <SelectItem value={BANK_CARD_TYPES.GOLOMT} disabled={disabledTerms}>
              Голомт банк
            </SelectItem>
          )}
          {mappedPts.map((payment) => (
            <SelectItem
              value={payment.type}
              disabled={payment.disabled}
              key={payment.type}
            >
              {payment.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectPaymentType
