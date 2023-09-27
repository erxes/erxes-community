import React, { useEffect, useRef } from "react"

import { Input } from "@/components/ui/input"

import { useChatMessages } from "../chat/hooks/useChatMessages"

const Editor = ({ chatId }: { chatId: string }) => {
  const { chatMessages, loading, handleLoadMore } = useChatMessages()

  return (
    <div>
      <Input />
    </div>
  )
}

export default Editor
