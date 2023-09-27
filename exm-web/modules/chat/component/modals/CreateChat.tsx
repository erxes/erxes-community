"use client"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { PenSquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

dayjs.extend(relativeTime)

export const CreateChat = ({}: {}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="p-4 bg-[#F0F0F0] rounded-full cursor-pointer">
            <PenSquareIcon size={18} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Төлбөрийн баримт авах</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" className="font-semibold">
              Баримт хэвлэх
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
