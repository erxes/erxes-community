import { CellContext } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { IOrderHistory } from "@/types/order.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const HistoryItemAction = ({ row }: CellContext<IOrderHistory, unknown>) => {
  const { _id, status } = row.original || {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Үйлдэлүүд</DropdownMenuLabel>
        <DropdownMenuItem>Идэвхтэй захиалга</DropdownMenuItem>
        <DropdownMenuItem>Баримт хэвлэх</DropdownMenuItem>
        <DropdownMenuItem>Дэлгэрэнгүй</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HistoryItemAction
