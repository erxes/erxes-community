import { orderItemInput, totalAmountAtom } from "@/store/cart.store"
import {
  activeOrderAtom,
  billTypeAtom,
  customerAtom,
  customerTypeAtom,
  deliveryInfoAtom,
  orderTypeAtom,
  registerNumberAtom,
  slotCodeAtom,
} from "@/store/order.store"
import { ApolloError, useMutation } from "@apollo/client"
import { useAtom } from "jotai"

import { getMode } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

import { mutations, queries } from "../graphql"

const useOrderCU = (onCompleted?: (id: string) => void) => {
  const { toast } = useToast()
  const [items] = useAtom(orderItemInput)
  const [totalAmount] = useAtom(totalAmountAtom)
  const [type] = useAtom(orderTypeAtom)
  const [_id] = useAtom(activeOrderAtom)
  const [customerType] = useAtom(customerTypeAtom)
  const [customer] = useAtom(customerAtom) || {}
  const [registerNumber] = useAtom(registerNumberAtom)
  const [billType] = useAtom(billTypeAtom)
  const [slotCode] = useAtom(slotCodeAtom)
  const [deliveryInfo] = useAtom(deliveryInfoAtom)
  const origin = getMode()

  // TODO: get type default from config
  const variables = {
    items,
    _id,
    customerType,
    customerId: customer?._id,
    registerNumber,
    billType,
    slotCode,
    origin,
    deliveryInfo,
    totalAmount,
    type: type || "eat",
  }

  const onError = (error: ApolloError) => {
    toast({ description: error.message, variant: "destructive" })
  }

  const [ordersAdd, { loading }] = useMutation(mutations.ordersAdd, {
    variables: variables,
    onCompleted(data) {
      const { _id } = (data || {}).ordersAdd || {}
      onCompleted && onCompleted(_id)
    },
    onError,
  })

  const [ordersEdit, { loading: loadingEdit }] = useMutation(
    mutations.ordersEdit,
    {
      variables,
      onCompleted(data) {
        const { _id } = (data || {}).ordersEdit || {}
        return onCompleted && onCompleted(_id)
      },
      refetchQueries: [{ query: queries.orderDetail }, "orderDetail"],
      onError,
    }
  )

  return {
    orderCU: _id ? ordersEdit : ordersAdd,
    loading: loading || loadingEdit,
    variables,
  }
}

export default useOrderCU
