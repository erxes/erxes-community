import React, { useEffect, useRef } from "react"

import { useChatMessages } from "../chat/hooks/useChatMessages"
import Editor from "./Editor"
import MessageList from "./MessageList"

const MessageContainer = ({ id }: { id: string }) => {
  const { chatMessages, loading, handleLoadMore } = useChatMessages()

  const renderContent = () => {
    if (id) {
      return (
        <div className="flex flex-col justify-end h-full">
          <MessageList
            chatId={id}
            // setReply={setReply}
          />
          {/* <ReplyInfo reply={reply} setReply={setReply} /> */}
          <Editor chatId={id} />
        </div>
      )
    }
  }

  return (
    <>
      <div className="flex w-full">
        <div className="w-3/4 border-r">{renderContent()}</div>
        <div className="w-1/3 ">cs</div>
      </div>
    </>
  )
}

export default MessageContainer
