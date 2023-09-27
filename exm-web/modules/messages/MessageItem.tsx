import React from "react"
import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import { useAtomValue } from "jotai"

import { currentUserAtom } from "../JotaiProiveder"

dayjs.extend(calendar)

const MessageItem = ({ message }: { message: any }) => {
  const { relatedMessage, content, attachments, createdAt, createdUser } =
    message
  const currentUser = useAtomValue(currentUserAtom)

  const isMe = currentUser?._id === createdUser._id

  return (
    <>
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div className="" dangerouslySetInnerHTML={{ __html: content || "" }} />
      </div>
    </>
  )
}

export default MessageItem
