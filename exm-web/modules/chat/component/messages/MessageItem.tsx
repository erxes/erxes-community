import React from "react"
import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import { useAtomValue } from "jotai"

import Avatar from "@/components/ui/avatar"

import { currentUserAtom } from "../../../JotaiProiveder"
import { IChatMessage } from "../../types"

dayjs.extend(calendar)

const MessageItem = ({ message }: { message: IChatMessage }) => {
  const { relatedMessage, content, attachments, createdAt, createdUser } =
    message

  const currentUser = useAtomValue(currentUserAtom)

  const isMe = currentUser?._id === createdUser._id

  const userDetail = createdUser.details || {}

  return (
    <>
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div>
          {isMe ? null : (
            <Avatar
              src={userDetail.avatar}
              alt="avatar"
              width={500}
              height={500}
              className="w-10 h-10 rounded-full"
            />
          )}
        </div>

        <div className="" dangerouslySetInnerHTML={{ __html: content || "" }} />
        <div>
          {isMe ? (
            <Avatar
              src={userDetail.avatar}
              alt="avatar"
              width={500}
              height={500}
              className="w-10 h-10 rounded-full"
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MessageItem
