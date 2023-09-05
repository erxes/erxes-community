"use client"

import { useCallback, useEffect } from "react"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { queries } from "@/modules/orders/graphql"
import { useQuery } from "@apollo/client"
import { format } from "date-fns"

import { IPutResponse, OrderItem } from "@/types/order.types"

import Stocks from "../../components/Stocks"

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
    <div className="space-y-1">
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

      <Stocks
        stocks={(items || []).map((item: OrderItem) => ({
          name: item.productName,
          qty: item.count,
          unitPrice: item.unitPrice,
          totalAmount: item.count * item.unitPrice,
        }))}
      />

      {type === "delivery" && !!deliveryInfo && (
        <div>
          Хүргэлтын мэдээлэл:{" "}
          <div dangerouslySetInnerHTML={{ __html: deliveryInfo }} />
        </div>
      )}
    </div>
  )
}

export default Progress
