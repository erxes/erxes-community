"use client"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { MessageCircle, ChevronRight } from "lucide-react"
import { useState } from "react"

import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "@/components/ui/image"
import { AttachmentWithChatPreview } from "@/components/AttachmentWithChatPreview"

import { useChatMessages } from "../../hooks/useChatMessages"
import { IChatMessage } from "../../types"

dayjs.extend(relativeTime)

export const PinnedMessages = () => {
  const { chatMessages } = useChatMessages()
  const [open, setOpen] = useState(false)

  const messages: IChatMessage[] = chatMessages.filter(
    (m) => m.isPinned === true
  )
  const renderPinnedMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex justify-center items-center flex-col p-4 mb-4">
          <MessageCircle size={25} className="mb-2" />
          <p>There is no pinned message</p>
        </div>
      )
    }

    return messages.map((message) => {
      const { createdAt, createdUser, _id, content, attachments } = message

      const renderContent = () => {
        if (content === "<p></p>") {
          return null
        }

        return (
          <div className="bg-[#F0F0F0] p-3 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: content || "" }} />
          </div>
        )
      }
      return (
        <div key={_id} className="mb-5">
          <div className="flex mb-4">
            <div className="items-end flex mr-3">
              <div className="w-12 h-12 rounded-full relative">
                <Image
                  src={
                    (createdUser && createdUser.details?.avatar) ||
                    "/avatar-colored.svg"
                  }
                  alt="avatar"
                  width={60}
                  height={60}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="indicator bg-success-foreground w-3 h-3 rounded-full border border-white mr-1 absolute bottom-0 right-0" />
              </div>
            </div>
            <div className={`text-[#444] w-full`}>
              <div className="flex justify-between">
                <p className="w-4/5 truncate text-base">
                  {createdUser?.details.fullName || createdUser?.email}
                </p>
                <p className="text-xs">
                  {createdAt && dayjs(createdAt).format("MMM D")}
                </p>
              </div>
              <p className="text-xs">({createdUser?.details.position})</p>
            </div>
          </div>
          {renderContent()}
          {attachments && attachments.length > 0 && (
            <AttachmentWithChatPreview
              attachments={attachments}
              className="m-2 overflow-x-auto w-60"
              isDownload={true}
            />
          )}
        </div>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild={true}>
          <div className="flex justify-between cursor-pointer text-black text-sm my-7">
            View pinned messages
            <ChevronRight size={18} />
          </div>
        </DialogTrigger>

    <DialogContent className="p-0 gap-0 max-w-md">
      <DialogHeader className="border-b p-4">
        <DialogTitle className="flex justify-around">
          Pinned messages
        </DialogTitle>
      </DialogHeader>
      <div className="px-4 pt-4 max-h-[60vh] overflow-y-auto">
        {renderPinnedMessages()}
      </div>
    </DialogContent>
      </Dialog>
  )
}
