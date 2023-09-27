"use client"

import dynamic from "next/dynamic"

const MessageContainer = dynamic(() => import("./MessageContainer"))

const Messages = ({ id }: { id: string }) => {
  return <MessageContainer id={id} />
}

export default Messages
