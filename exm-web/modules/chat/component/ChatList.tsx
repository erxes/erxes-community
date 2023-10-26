"use client"

import { useEffect, useState } from "react"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAtomValue } from "jotai"
import { ChevronDown, PenSquareIcon } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "@/components/ui/image"
import { Input } from "@/components/ui/input"
import LoadingCard from "@/components/ui/loading-card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useChats } from "../hooks/useChats"
import { ChatItem } from "./ChatItem"
import { ChatForm } from "./form/ChatForm"

dayjs.extend(relativeTime)

const ChatList = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const currentUser = useAtomValue(currentUserAtom)
  const [searchValue, setSearchValue] = useState("")
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const { chats, chatsCount, loading, handleLoadMore, pinnedChats, refetch } =
    useChats({
      searchValue,
    })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore])

  const renderAction = () => {
    return (
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild={true}>
          <div>
            <PenSquareIcon size={18} />
          </div>
        </DialogTrigger>

        <ChatForm setOpen={setOpen} refetch={refetch} />
      </Dialog>
    )
  }

  const handleSearch = (event: any) => {
    setSearchValue(event.target.value)
  }

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index)
  }

  const renderChats = () => {
    return chats.map((c: any) => {
      if (c.type === "group") {
        return null
      }
      return (
        <ChatItem
          key={c._id}
          chat={c}
          isPinned={c.isPinnedUserIds.includes(currentUser?._id)}
        />
      )
    })
  }

  const renderGroupChats = () => {
    return chats.map((c: any) => {
      if (c.type === "direct") {
        return null
      }
      return (
        <ChatItem
          key={c._id}
          chat={c}
          isPinned={c.isPinnedUserIds.includes(currentUser?._id)}
        />
      )
    })
  }

  const renderPinnedChats = () => {
    if (pinnedChats.length !== 0) {
      return pinnedChats.map((c: any) => (
        <ChatItem
          key={c._id}
          chat={c}
          isPinned={c.isPinnedUserIds.includes(currentUser?._id)}
        />
      ))
    }
  }

  const renderCurrentUserStatus = () => {
    return (
      <div>
        <div className="p-4 flex items-center">
          <Image
            src={currentUser?.details.avatar || "/avatar-colored.svg"}
            alt="avatar"
            width={60}
            height={60}
            className="w-14 h-14 rounded-full object-cover ml-5 mr-3"
          />
          <div className="flex sm:flex-col items-start">
            <div className="text-lg mb-2">
              {currentUser?.details.fullName || currentUser?.email}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="bg-success text-success-foreground px-4 py-2 sm:rounded-lg flex items-center">
                  <div className="indicator bg-success-foreground w-3 h-3 rounded-full border border-white mr-1" />
                  Active
                  <ChevronDown size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-transparent border-0 shadow-none px-2.5">
                <button className="bg-warning-foreground text-warning px-4 py-2 sm:rounded-lg flex items-center w-full">
                  <div className="indicator bg-warning w-3 h-3 rounded-full border border-white mr-1" />
                  Busy
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="w-full overflow-auto h-screen">
      {renderCurrentUserStatus()}

      <div className="flex items-center justify-between p-6">
        <h5 className="text-base font-semibold text-[#444]">Create new chat</h5>
        {renderAction()}
      </div>

      <div className="px-4">
        <Input
          className={"sm:rounded-lg border-[#DEE4E7]"}
          value={searchValue}
          placeholder={"Search Chat"}
          onChange={handleSearch}
        />
      </div>

      <div className="mt-4">
        <div>
          <div className="flex px-4">
            {["Chat", "Groups", "Pinned"].map((type, index) => (
              <button
                key={index}
                className={`py-2 px-4 flex-1 ${
                  activeTabIndex === index && "border-b border-primary"
                }`}
                onClick={() => handleTabClick(index)}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="p-4 overflow-auto chat-list-max-height">
            {activeTabIndex === 0 && renderChats()}
            {activeTabIndex === 1 && renderGroupChats()}
            {activeTabIndex === 2 && renderPinnedChats()}
          </div>
        </div>

        {!loading && chats.length < chatsCount && (
          <div ref={ref}>
            <LoadingCard type="chatlist" />
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

export default ChatList
