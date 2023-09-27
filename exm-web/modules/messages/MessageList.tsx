import React, { useEffect, useRef } from "react"

import { useChatMessages } from "../chat/hooks/useChatMessages"

const MessageList = ({ chatId }: { chatId: string }) => {
  const { chatMessages, loading, handleLoadMore } = useChatMessages()

  return <>hi</>
}

export default MessageList
