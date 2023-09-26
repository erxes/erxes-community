"use client"

import { useEffect, useState } from "react"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAtomValue } from "jotai"
import { PenSquareIcon } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Input } from "@/components/ui/input"

import { useChats } from "../hooks/useChats"
import { ChatItem } from "./ChatItem"
import { CreateChat } from "./modals/CreateChat"

dayjs.extend(relativeTime)

const ChatList = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const currentUser = useAtomValue(currentUserAtom)
  const { chats, chatsCount, loading, handleLoadMore } = useChats()
  const [searchValue, setSearchValue] = useState("")
  const [filteredChats, setFilteredChats] = useState<any[]>([])

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView])

  if (loading) {
    return <div className="mt-4">loading...</div>
  }

  const renderAction = () => {
    return <CreateChat />
  }

  const handleSearch = (event: any) => {
    setSearchValue(event.target.value)
    const inputValue = event.target.value

    setFilteredChats(
      chats.filter((item: any) => {
        let name = ""

        if (item.type === "direct") {
          const users: any[] = item.participantUsers || []
          const user: any =
            users.length > 1
              ? users.filter((u) => u._id !== currentUser?._id)[0]
              : users[0]
          name = user.details.fullName || user.email
          return (
            name.toLowerCase().includes(inputValue.toLowerCase()) ||
            user.details.position
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          )
        } else {
          name = item.name
          return name.toLowerCase().includes(inputValue.toLowerCase())
        }
      })
    )
  }

  const renderChats = () =>
    chats.map((c: any) => <ChatItem key={c._id} chat={c} />)

  const renderFilteredChats = () => {
    return filteredChats.map((c) => <ChatItem key={c._id} chat={c} />)
  }

  return (
    <div className="w-full overflow-auto h-screen">
      <div className="flex items-center justify-between p-6">
        <h3 className="text-2xl font-semibold text-[#444]">Chats</h3>
        {renderAction()}
      </div>

      <div className="px-6">
        <Input
          className={"rounded-full border-[#DEE4E7]"}
          value={searchValue}
          placeholder={"Search Chat"}
          onChange={handleSearch}
        />
      </div>

      <div className="mt-4">
        {searchValue.length === 0 ? (
          <>
            {/* {renderPinnedChats()} */}
            {renderChats()}
          </>
        ) : (
          <>{renderFilteredChats()}</>
        )}
        <div ref={ref}>
          {!loading && chatsCount > 20 && chats.length < chatsCount && (
            <>
              <div className="bg-white p-6 flex items-center">
                <div className="rounded-full bg-slate-100 w-14 h-14 mr-4" />
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="rounded-full bg-slate-100 w-full h-6 mb-2" />
                  <div className="rounded-full bg-slate-100 w-4/5 h-4" />
                </div>
              </div>
              <div className="bg-white p-6 flex items-center">
                <div className="rounded-full bg-slate-100 w-14 h-14 mr-4" />
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="rounded-full bg-slate-100 w-full h-6 mb-2" />
                  <div className="rounded-full bg-slate-100 w-4/5 h-4" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatList
