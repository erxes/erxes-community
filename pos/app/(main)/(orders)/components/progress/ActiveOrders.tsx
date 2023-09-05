import { useEffect } from "react"
import { queries } from "@/modules/orders/graphql"
import useFullOrders from "@/modules/orders/hooks/useFullOrders"
import { columnNumberAtom, filterAtom } from "@/store/progress.store"
import { useAtomValue } from "jotai"
import { Loader2Icon } from "lucide-react"

import { ORDER_ITEM_STATUSES, ORDER_STATUSES } from "@/lib/constants"
import { Button } from "@/components/ui/button"

import ActiveOrder from "./ActiveOrder"
import PrintProgress from "./PrintProgress"

const ActiveOrders = () => {
  const filter = useAtomValue(filterAtom)
  const num = useAtomValue(columnNumberAtom)

  const {
    loading,
    fullOrders,
    handleLoadMore,
    totalCount,
    subToOrderStatuses,
    subToItems,
  } = useFullOrders({
    variables: filter,
    query: queries.progressHistory,
  })

  useEffect(() => {
    subToOrderStatuses(ORDER_STATUSES.ALL)
    subToItems(ORDER_ITEM_STATUSES.ALL)
  }, [])

  if (loading) return null

  const arr = []

  for (let i = 0; i < num; i++) {
    arr[i] = fullOrders.filter((_, index) => index % num === i)
  }

  return (
    <div
      className="mx-4 grid gap-3 my-3 flex-auto"
      style={{ gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))` }}
    >
      {arr.map((orders, idx) => (
        <div className="space-y-3" key={idx}>
          {orders.map((order) => (
            <ActiveOrder {...order} key={order._id} />
          ))}
        </div>
      ))}

      {totalCount > fullOrders.length && (
        <Button className="my-1" onClick={handleLoadMore}>
          Цааш үзэх {fullOrders.length}/{totalCount}
        </Button>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40">
          <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
          Уншиж байна...
        </div>
      )}
      <PrintProgress />
    </div>
  )
}

export default ActiveOrders
