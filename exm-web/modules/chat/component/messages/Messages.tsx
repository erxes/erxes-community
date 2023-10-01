"use client"

import { useChatMessages } from "../../hooks/useChatMessages"
import Editor from "./Editor"
import MessageItem from "./MessageItem"

const Messages = () => {
  const { chatMessages, loading, error, sendMessage, handleLoadMore } =
    useChatMessages()

  if (error) {
    return <div>Someting went wrong</div>
  }

  if (loading) {
    return <div />
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <div
        className="flex-1 flex-col-reverse overflow-y-scroll p-4 border-0 "
        style={{ scrollBehavior: "smooth" }}
      >
        {chatMessages.map((message) => (
          <MessageItem key={message._id} message={message} />
        ))}
      </div>
      <div className="p-4">
        <Editor sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default Messages
