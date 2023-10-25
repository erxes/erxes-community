"use client"

import React, { useMemo, useState } from "react"
import { IUser } from "@/modules/auth/types"
import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import { useAtomValue } from "jotai"
import { ReplyIcon } from "lucide-react"

import Image from "@/components/ui/image"
import { AttachmentWithChatPreview } from "@/components/AttachmentWithChatPreview"

import { currentUserAtom } from "../../../JotaiProiveder"
import { IChatMessage } from "../../types"

dayjs.extend(calendar)

const MessageItem = ({
  message,
  setReply,
  type,
}: {
  message: IChatMessage
  setReply: (message: any) => void
  type: string
}) => {
  const { relatedMessage, content, attachments, createdAt, createdUser } =
    message

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

  const messageContent = (message: string) => {
    var urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
    return message.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-blue-500 font-bold">${url}</a>`
    })
  }

  const renderReplyText = () => {
    return (
      <div className="flex gap-2 text-xs text-[#444] font-medium">
        <ReplyIcon size={16} />
        {isMe
          ? `You replied to ${
              relatedMessage.createdUser._id === createdUser._id
                ? "yourself"
                : userInfo
            } `
          : `
        ${userDetail.fullName || createdUser.email} replied to ${
              relatedMessage.createdUser._id === createdUser._id
                ? "themself"
                : userInfo
            }
        `}
      </div>
    )
  }

  const messageReplySection = (messageContent: string) => {
    const style = isMe
      ? ` ${"bg-[#F8F8F8] text-[#000] rounded-lg"} font-medium`
      : ` ${"bg-[#F8F8F8] text-[#000] rounded-lg"} font-medium`
    return (
      <>
        {renderReplyText()}
        <div
          className={`${style} py-2.5 px-5 max-w-xs h-10 overflow-hidden truncate drop-shadow-md`}
          dangerouslySetInnerHTML={{ __html: messageContent || "" }}
        />
      </>
    )
  }

  const messageSection = (messageContent: string) => {
    const style = isMe
      ? ` ${"bg-[#4F33AF] text-[#fff] rounded-tr-none rounded-tl-lg rounded-br-lg rounded-bl-lg"}  font-medium`
      : ` ${"bg-[#F2F3F5] text-[#000] rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg"} font-medium`
    return (
      <div
        className={`${style} py-2.5 px-5 max-w-md drop-shadow-md`}
        dangerouslySetInnerHTML={{ __html: messageContent || "" }}
      />
    )
  }

  const attachmentSection = () => {
    const medias = attachments.filter((attachment) =>
      attachment.type.startsWith("image/")
    )
    const files = attachments.filter((attachment) =>
      attachment.type.startsWith("application/")
    )

    let cols = medias.length < 3 ? medias.length : 3
    return (
      <>
        {medias && (
          <AttachmentWithChatPreview
            attachments={medias}
            className={`grid grid-cols-${cols} gap-1 py-1`}
            isDownload={true}
          />
        )}
        {files && (
          <AttachmentWithChatPreview
            attachments={files}
            className={`flex flex-col gap-1 py-1`}
            isDownload={true}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div
        className={`w-full my-1 flex items-start gap-[10px] ${
          isMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className={`shrink-0 w-11 h-11 ${relatedMessage && "pt-4"}`}>
          <Image
            src={userDetail.avatar ? userDetail.avatar : "/avatar-colored.svg"}
            alt="avatar"
            width={60}
            height={60}
            className="w-11 h-11 rounded-full object-cover"
          />
        </div>

        <div
          className={`flex flex-col gap-1 ${
            isMe ? "items-end" : "items-start"
          }`}
        >
          {isMe || relatedMessage || type === "direct" ? null : (
            <div className="flex gap-1 items-center">
              <span className="font-semibold text-[#000]">
                {userDetail.fullName || userDetail?.email}
              </span>
              {userDetail.position ? (
                <span className="font-medium text-[#7B7B7B]">
                  ({`${userDetail.position}`})
                </span>
              ) : null}
            </div>
          )}

          <div
            className={`flex flex-col gap-1 ${
              isMe ? "items-end" : "items-start"
            }`}
          >
            <div className="flex flex-col gap-1">
              {relatedMessage &&
                messageReplySection(messageContent(relatedMessage.content))}
            </div>
            <div
              className={`flex gap-2 items-center ${
                isMe ? "flex-row-reverse" : "flex-row"
              }`}
              onMouseEnter={() => setShowAction(true)}
              onMouseLeave={() => setShowAction(false)}
            >
              {messageSection(messageContent(content))}
              {showAction ? (
                <div className={``}>
                  <ReplyIcon
                    size={16}
                    className={`${isMe ? "mr-1" : "ml-1"} cursor-pointer`}
                    onClick={() => setReply(message)}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {attachments && attachments.length > 0 && attachmentSection()}

          <div className="text-[#BBBABA] text-[10px]">
            {dayjs(createdAt).calendar(null, {
              sameDay: "h:mm A",
              lastDay: "[Yesterday], h:mm A",
              lastWeek: "dddd, h:mm A",
              sameElse: "MMMM DD, YYYY h:mm A",
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageItem
