"use client"

import { useState } from "react"
import Image from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { PenSquareIcon } from "lucide-react"

import { readFile } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { useChats } from "../hooks/useChats"
import { ChatItem } from "./ChatItem"

dayjs.extend(relativeTime)

export const ChatList = () => {
  const { chats, chatsCount, loading, handleLoadMore } = useChats()
  const [searchValue, setSearchValue] = useState("")
  const [filteredChats, setFilteredChats] = useState([])

  const renderChats = () =>
    chats.map((c: any) => <ChatItem key={c._id} chat={c} />)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-6">
        <h3 className="text-2xl font-semibold text-[#444]">Chats</h3>
        <div className="p-4 bg-[#F0F0F0] rounded-full">
          <PenSquareIcon size={18} />
        </div>
      </div>

      <div className="px-6">
        <Input
          className={"rounded-full border-[#DEE4E7]"}
          value={""}
          placeholder={"Хайх.."}
        />
      </div>

      <div className="mt-4">
        {searchValue.length === 0 ? (
          <>
            {/* {renderPinnedChats()} */}
            {renderChats()}
          </>
        ) : (
          <>
            {/* {renderFilteredChats()}
          {renderFilteredUsers()} */}
          </>
        )}
      </div>
    </div>
  )
}
