import { mutations } from "@/modules/orders/graphql"
import { useMutation } from "@apollo/client"
import { Loader2Icon, SoupIcon, TruckIcon } from "lucide-react"

import { OrderItem } from "@/types/order.types"
import { ORDER_ITEM_STATUSES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import { useToast } from "@/components/ui/use-toast"

const ActiveOrderItem = ({
  productName,
  count,
  isTake,
  status,
  _id,
}: OrderItem) => {
  const { onError } = useToast()
  const [changeStatus, { loading }] = useMutation(
    mutations.orderItemChangeStatus,
    {
      onError,
    }
  )

  const Icon = loading ? Loader2Icon : isTake ? TruckIcon : SoupIcon
  return (
    <Toggle
      className="w-full justify-between"
      disabled={loading}
      pressed={status === ORDER_ITEM_STATUSES.DONE}
      onPressedChange={() =>
        changeStatus({
          variables: {
            _id,
            status:
              status === ORDER_ITEM_STATUSES.DONE
                ? ORDER_ITEM_STATUSES.CONFIRM
                : ORDER_ITEM_STATUSES.DONE,
          },
        })
      }
    >
      <span className="inline-flex items-end text-xs">
        <Icon className={cn("h-5 w-5 mr-1", loading && "animate-spin")} />
        {productName}
      </span>
      <b>x{count}</b>
    </Toggle>
  )
}

export default ActiveOrderItem
