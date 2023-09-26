"use client"

import { useState } from "react"
import Image from "next/image"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAtomValue } from "jotai"

import { readFile } from "@/lib/utils"
import { Card } from "@/components/ui/card"

dayjs.extend(relativeTime)

export const ChatItem = ({ chat }: { chat?: any }) => {
  const currentUser = useAtomValue(currentUserAtom)

  const users: any[] = chat?.participantUsers || []
  const user: any =
    users?.length > 1
      ? users?.filter((u) => u._id !== currentUser?._id)[0]
      : users?.[0]

  return (
    <Card className="px-6 rounded-none py-2.5 cursor-pointer flex items-center shadow-none border-none bg-transparent hover:bg-[#F0F0F0]">
      <Image
        src={readFile((user && user.details?.avatar) || "/avatar-colored.svg")}
        alt="User Profile"
        width={500}
        height={500}
        className="w-12 h-12 rounded-full mr-4"
      />

      <div className="text-sm text-[#444] w-full">
        <p>
          {chat && chat.type === "direct" ? (
            <>
              {user?.details.fullName || user?.email}
              <span> ({user?.details.position})</span>
            </>
          ) : (
            chat?.name
          )}
        </p>
        <div className="flex justify-between w-full text-xs font-normal">
          <p>{(chat?.lastMessage && chat?.lastMessage.content) || ""}</p>
          <p>
            {chat.lastMessage &&
              chat.lastMessage.createdAt &&
              dayjs(chat.lastMessage.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </Card>
  )
}
