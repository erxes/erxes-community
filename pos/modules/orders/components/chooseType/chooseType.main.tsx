import { orderTypeAtom } from "@/store/order.store"
import { useAtom } from "jotai"

import { IOrderType } from "@/types/order.types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ChooseType = () => {
  const [type, setType] = useAtom(orderTypeAtom)
  return (
    <Select value={type} onValueChange={(value: IOrderType) => setType(value)}>
      <SelectTrigger className="h-11 bg-black text-center text-sm font-bold text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="eat">Зааланд</SelectItem>
          <SelectItem value="take">Авч явах</SelectItem>
          <SelectItem value="delivery">Хүргэлтээр</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ChooseType
