import dynamic from "next/dynamic"
import { orderTypeAtom } from "@/store/order.store"
import { useAtomValue } from "jotai"

const DeliveryInputs = dynamic(() => import("./"), {
  loading: () => <div className="h-8 w-full col-span-2" />,
})

const ShowDeliveryInfo = () => {
  const type = useAtomValue(orderTypeAtom)
  return type === "delivery" ? <DeliveryInputs /> : null
}

export default ShowDeliveryInfo
