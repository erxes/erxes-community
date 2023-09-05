import {
  deliveryInfoAtom,
  dueDateAtom,
  setDeliveryInfoAtom,
} from "@/store/order.store"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { BookmarkPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const DeliveryInputs = () => {
  const setDeliveryInfo = useSetAtom(setDeliveryInfoAtom)
  const deliveryInfo = useAtomValue(deliveryInfoAtom)
  // const [dueDate, setDueDate] = useAtom(dueDateAtom)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="col-span-2 font-semibold ">
          <BookmarkPlus className="mr-1 h-5 w-5" />
          Хүргэлтын мэдээлэл
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <CardTitle className="mb-2">Хүргэлтын мэдээлэл</CardTitle>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 pb-1">
            <Label htmlFor="delivery" className="block pb-1">
              Хаягын мэдээлэл
            </Label>
            <Textarea
              className="max-h-20"
              value={(deliveryInfo || {}).description}
              onChange={(e) => setDeliveryInfo(e.target.value)}
            />
          </div>
          {/* <div className="col-span-2">
            <Label className="block pb-1">Хүргэх өдөр</Label>
            <DatePicker
              date={dueDate || new Date()}
              setDate={() => {}}
              fromDate={new Date()}
              className="w-full"
            />
          </div>
          <div>
            <Label className="block pb-1">Хүргэх цаг</Label>
            <Input type="time" />
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DeliveryInputs
