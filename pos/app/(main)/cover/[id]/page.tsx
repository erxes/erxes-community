"use client"

import { useParams } from "next/navigation"
import useConfig from "@/modules/auth/hooks/useConfig"
import { setCoverDetailAtom } from "@/store/cover.store"
import { useQuery } from "@apollo/client"
import { useAtom } from "jotai"
import { Loader2Icon } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

import Amounts from "../components/amounts"
import Dates from "../components/cover-detail-dates"
import CoverCU from "../components/coverCU"
import { queries } from "../graphql"

const CoverDetail = () => {
  const params = useParams()
  const { id } = params || {}
  const { onError } = useToast()
  const [, setCover] = useAtom(setCoverDetailAtom)

  const { loading: loadingConfig } = useConfig("cover")

  const { loading } = useQuery(queries.coverDetail, {
    variables: { id },
    fetchPolicy: "network-only",
    skip: !id || id === "create",
    onCompleted(data) {
      const { coverDetail } = data || {}
      setCover(coverDetail || {})
      // getCoverAmounts({
      //   variables: {
      //     endDate: coverDetail.endDate,
      //     id,
      //   },
      // })
    },
    onError,
  })

  if (loading || loadingConfig) {
    return (
      <div className="flex flex-auto items-center justify-center">
        <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
        Уншиж байна...
      </div>
    )
  }

  return (
    <div className="flex-auto overflow-hidden ">
      <ScrollArea className="h-full max-h-full px-5 py-4">
        <div className="flex items-start justify-between">
          <Dates />
          <CoverCU />
        </div>
        <Amounts />
      </ScrollArea>
    </div>
  )
}

export default CoverDetail
