import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { OperationVariables } from "@apollo/client"
import { Loader2Icon } from "lucide-react"

import useOrderDetail from "./hooks/useOrderDetail"

const OrderDetail = ({
  children,
  variables,
}: {
  children: any
  variables?: OperationVariables
}) => {
  const { loading } = useOrderDetail({ variables: variables })

  if (loading)
    return (
      <div className="flex flex-auto items-center justify-center">
        <Loader2Icon className="mr-3 h-5 w-5 animate-spin" />
        Уншиж байна...
      </div>
    )
  return children
}

export default OrderDetail
