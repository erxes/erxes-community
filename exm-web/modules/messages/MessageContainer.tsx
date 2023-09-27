import React, { useEffect, useRef } from "react"

import { useChatMessages } from "../chat/hooks/useChatMessages"
import MessageList from "./MessageList"

const MessageContainer = ({ id }: { id: string }) => {
  const { chatMessages, loading, handleLoadMore } = useChatMessages()

  const renderContent = () => {
    if (id) {
      return (
        // <PageContent transparent={false} center={true}>
        //   <PageContentWrapper>
        <MessageList
          chatId={id}
          // setReply={setReply}
        />
        // <ReplyInfo reply={reply} setReply={setReply} />
        // <Editor chatId={chatId} reply={reply} setReply={setReply} />
        //   </PageContentWrapper>
        // </PageContent>
      )
    } else {
      return <>Select a chat or start a new conversation</>
    }
  }

  return (
    <>
      <div className="flex w-full">
        <div className="w-3/4 bg-[#F9F9F9] border-r">{renderContent()}</div>
        <div className="w-1/3 ">cs</div>
      </div>
    </>
  )
}

export default MessageContainer
