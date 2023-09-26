"use client"

import dynamic from "next/dynamic"

const ChatList = dynamic(() => import("./ChatList"))

const Chat = () => {
  return <ChatList />
}

export default Chat
