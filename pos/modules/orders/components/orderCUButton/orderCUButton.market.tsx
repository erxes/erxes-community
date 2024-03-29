import useOrderCU from "@/modules/orders/hooks/useOrderCU"
import { cartAtom } from "@/store/cart.store"
import { activeOrderAtom } from "@/store/order.store"
import { useAtom } from "jotai"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const OrderCUButton = ({ variant }: { variant?: "outline" }) => {
  const [cart] = useAtom(cartAtom)
  const [, setActive] = useAtom(activeOrderAtom)
  const { orderCU, loading } = useOrderCU((id) => setActive(id))

  return (
    <Button
      className={cn(
        "w-full",
        !variant && " bg-green-500 hover:bg-green-500/90"
      )}
      size="lg"
      disabled={cart.length === 0}
      loading={loading}
      onClick={() => orderCU()}
      variant={variant}
    >
      Төлбөр төлөх
    </Button>
  )
}

export default OrderCUButton
