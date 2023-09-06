"use client"

import { useCallback, useEffect } from "react"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { queries } from "@/modules/orders/graphql"
import { useQuery } from "@apollo/client"
import { format } from "date-fns"

import { OrderItem } from "@/types/order.types"
import { Separator } from "@/components/ui/separator"

const Progress = ({ params }: { params: Params }) => {
  const { id } = params

  const { loading, data } = useQuery(queries.progressDetail, {
    variables: { id },
    onCompleted() {
      return setTimeout(() => window.print(), 20)
    },
  })

  const handleAfterPrint = useCallback(() => {
    const data = { message: "close" }
    window.parent.postMessage(data, "*")
  }, [])

  useEffect(() => {
    window.addEventListener("afterprint", handleAfterPrint)
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint)
    }
  }, [handleAfterPrint])

  if (loading) return <div></div>

  const { number, modifiedAt, items, deliveryInfo, type } =
    data?.orderDetail || {}

  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center justify-between font-semibold text-xs">
        <span className="">Erxes pos</span>
        <span>#{(number || "").split("_")[1]}</span>
      </div>
      <div>
        Огноо:{" "}
        <span className="font-semibold">
          {modifiedAt && format(new Date(modifiedAt), "yyyy.MM.dd HH:mm:ss")}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between font-semibold">
          <span>Бараа</span>
          <span>Т/Ш</span>
        </div>
        <Separator />
        {items.map((item: OrderItem) => (
          <div className="flex items-center justify-between" key={item._id}>
            <span>{item.productName}</span>
            <span>x{item.count}</span>
          </div>
        ))}
      </div>

      {type === "delivery" && !!deliveryInfo && (
        <div>
          <div className="font-semibold">Хүргэлтын мэдээлэл:</div>
          {Object.keys(deliveryInfo).map((key) => (
            <div className="flex" key={key}>
              <span className="font-semibold pr-1">{key}:</span>
              <span>{deliveryInfo[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Progress
