import useConfig from "@/modules/auth/hooks/useConfig"
import { paymentConfigAtom } from "@/store/config.store"
import { useAtom } from "jotai"

import { strToObj } from "@/lib/utils"

import PaymentType from "../paymentType/paymentType.market"

const PaymentTypes = () => {
  const [config, setConfig] = useAtom(paymentConfigAtom)
  const { loading } = useConfig("payment", {
    onCompleted: ({ paymentTypes, ...rest }) => {
      const paymentTypeWithConfig = paymentTypes.map((pt) => ({
        ...pt,
        config: strToObj(pt.config),
      }))
      setConfig({ ...rest, paymentTypes: paymentTypeWithConfig })
    },
    skip: !!config,
  })

  return (
    <>
      {loading ? <div className="h-12" /> : <PaymentType />}
      {/* <div className="flex items-center">
        <Button className="mr-7 flex-auto" variant="outline" disabled={loading}>
          <PlusIcon className="text-black/50" />
        </Button>
      </div> */}
    </>
  )
}

export default PaymentTypes
