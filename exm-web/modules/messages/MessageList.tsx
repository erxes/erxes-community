import React, { useEffect, useRef } from "react"

import { useChatMessages } from "../chat/hooks/useChatMessages"
import MessageItem from "./MessageItem"

const MessageList = ({ chatId }: { chatId: string }) => {
  const { chatMessages, loading, handleLoadMore } = useChatMessages()

  return (
    <div className="w-full h-full flex flex-col-reverse">
      {chatMessages.map((message: any) => (
        <MessageItem key={message._id} message={message} />
      ))}
    </div>
  )
}

export default MessageList
