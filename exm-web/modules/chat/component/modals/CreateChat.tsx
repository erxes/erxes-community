"use client"

import { useQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { PenSquareIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { queries } from "../../graphql"

dayjs.extend(relativeTime)

export const CreateChat = ({}: {}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild={true}>
          <div className="p-4 bg-[#F0F0F0] rounded-full cursor-pointer">
            <PenSquareIcon size={18} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a chat</DialogTitle>
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
