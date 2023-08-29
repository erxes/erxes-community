import useGolomt from "@/modules/checkout/hooks/useGolomt"
import useKhanCard from "@/modules/checkout/hooks/useKhanCard"
import useTDB from "@/modules/checkout/hooks/useTDB"
import { paymentConfigAtom } from "@/store/config.store"
import { useAtom } from "jotai"

import { useCheckNotSplit } from "./usePaymentType"

const usePossiblePaymentTerms = () => {
  const [config] = useAtom(paymentConfigAtom)
  const { paymentIds } = config || {}
  const { loading: loadingKhan, isAlive: khan } = useKhanCard({
    skipCheck: true,
  })
  const { paymentType: tdb } = useTDB()
  const { isIncluded: golomt } = useGolomt()
  const { mappedPts, paidNotSplit } = useCheckNotSplit()

  const disabledTerms = !!paidNotSplit

  return {
    loadingKhan,
    disabledTerms,
    paymentIds,
    khan,
    tdb,
    golomt,
    mappedPts,
  }
}

export default usePossiblePaymentTerms
