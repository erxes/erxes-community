"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useInView } from "react-intersection-observer"

import Image from "@/components/ui/image"
import Loader from "@/components/ui/loader"

import { useChatDetail } from "../../hooks/useChatDetail"
import { useChatMessages } from "../../hooks/useChatMessages"
import Editor from "./Editor"
import MessageItem from "./MessageItem"
import MessagesHeader from "./MessagesHeader"
import ReplyInfo from "./ReplyInfo"
import TypingIndicator from "./TypingIndicator"

const Messages = () => {
  const {
    chatMessages,
    loading,
    error,
    sendMessage,
    handleLoadMore,
    messagesTotalCount,
  } = useChatMessages()

  const { chatDetail } = useChatDetail()
  const chatContainerRef = useRef(null) as any
  const [reply, setReply] = useState<any>(null)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  if (error) {
    return <div>Something went wrong</div>
  }

  if (loading) {
    return <div />
  }

  return (
    <div className="flex flex-col h-screen relative">
      <div className="h-24 border-b-2 flex items-center justify-between px-10">
        <MessagesHeader chatDetail={chatDetail} />
      </div>
      <button
        onClick={() => {
          console.log(chatContainerRef)

          chatContainerRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }}
        className="bg-[#EED8FF] text-center p-1 mx-10 rounded-b-lg"
      >
        new messages since 9:00 OM On October 11, 2023
      </button>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 border-0 flex flex-col-reverse scrollbar-hide "
      >
        <div className="w-full pt-2">
          {chatDetail.participantUsers && (
            <TypingIndicator participants={chatDetail.participantUsers} />
          )}
        </div>
        {chatMessages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            setReply={setReply}
            type={chatDetail.type}
          />
        ))}

        {!loading && chatMessages.length < messagesTotalCount && (
          <div ref={ref}>
            <Loader />
          </div>
        )}
      </div>
      <ReplyInfo reply={reply} setReply={setReply} />

      <Editor sendMessage={sendMessage} reply={reply} setReply={setReply} />
    </div>
  )
}

export default Messages
