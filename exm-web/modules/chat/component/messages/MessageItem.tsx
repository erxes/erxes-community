"use client"

import React, { useMemo, useState } from "react"
import { IUser } from "@/modules/auth/types"
import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import { useAtomValue } from "jotai"
import { Pin, PinOff, ReplyIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import Image from "@/components/ui/image"
import { AttachmentWithChatPreview } from "@/components/AttachmentWithChatPreview"

import { currentUserAtom } from "../../../JotaiProiveder"
import { useChatMessages } from "../../hooks/useChatMessages"
import { IChatMessage } from "../../types"

dayjs.extend(calendar)

const MessageItem = ({
  message,
  setReply,
}: {
  message: IChatMessage
  setReply: (message: any) => void
}) => {
  const { relatedMessage, content, attachments, createdUser } = message

  const { pinMessage } = useChatMessages()

  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)
  const [showAction, setShowAction] = useState(false)

  const isMe = useMemo(
    () => currentUser?._id === createdUser._id,
    [createdUser]
  )

  const userDetail = createdUser.details || {}

  const userInfo =
    relatedMessage &&
    relatedMessage.createdUser &&
    (relatedMessage.createdUser.details.fullName ||
      relatedMessage.createdUser.email)

  const renderReplyText = () => {
    if (isMe) {
      return (
        <div className="text-xs text-[#444] font-medium">
          You replied to{" "}
          {relatedMessage.createdUser._id === currentUser._id
            ? "yourself"
            : userInfo}
        </div>
      )
    }

    return (
      <div className="text-xs text-[#444] font-medium">
        {(userDetail.fullName || createdUser.email) + "replied to "}
        {relatedMessage.createdUser._id === createdUser._id
          ? "themself"
          : userInfo}
      </div>
    )
  }

  return (
    <div className="mt-2">
      {relatedMessage && (
        <div
          className={`flex ${
            isMe ? "justify-end" : "justify-start"
          } text-xs text-[#444] font-medium`}
        >
          <div className="max-w-md">
            <div className="flex">
              <ReplyIcon size={16} /> {renderReplyText()}
            </div>
            <p className="truncate bg-[#ededfb] p-2 sm:rounded-lg">
              {relatedMessage.content}
            </p>
          </div>
        </div>
      )}

      <div
        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
        onMouseEnter={() => setShowAction(true)}
        onMouseLeave={() => setShowAction(false)}
      >
        <div className="flex items-end">
          {isMe ? null : (
            <div className="w-10 h-10 rounded-full mr-2 mb-2">
              <Image
                src={userDetail.avatar}
                alt="avatar"
                width={60}
                height={60}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <div
          className={`${
            isMe ? "flex-row" : "flex-row-reverse"
          } flex items-center gap-3`}
        >
          {showAction ? (
            <div
              className={`flex gap-3 ${isMe ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="p-2.5 bg-[#F2F2F2] rounded-full cursor-pointer">
                <ReplyIcon size={16} onClick={() => setReply(message)} />
              </div>
              <div className="p-2.5 bg-[#F2F2F2] rounded-full cursor-pointer">
                {message.isPinned ? (
                  <PinOff size={16} onClick={() => pinMessage(message._id)} />
                ) : (
                  <Pin size={16} onClick={() => pinMessage(message._id)} />
                )}
              </div>
            </div>
          ) : null}

          <div className="max-w-md">
            {attachments && attachments.length > 0 ? (
              <>
                <Card className="p-4 sm:rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: content || "" }} />
                </Card>
                <AttachmentWithChatPreview
                  attachments={attachments}
                  className="m-2 overflow-x-auto w-60"
                  isDownload={true}
                />
              </>
            ) : (
              <Card className="p-3 sm:rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: content || "" }} />
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className={`flex justify-end mt-1`}>
        {message.seenList.map((item) => {
          if (currentUser._id === item.user._id) {
            return null
          }
          return (
            <Image
              key={item.user._id}
              src={item.user.details.avatar}
              alt="avatar"
              width={60}
              height={60}
              className="w-5 h-5 rounded-full object-cover p-1px"
            />
          )
        })}
      </div>
    </div>
  )
}

export default MessageItem
