import React, { useState } from "react"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { useAtomValue } from "jotai"
import { MoveLeft, Search } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "@/components/ui/image"
import Loader from "@/components/ui/loader"
import { useAllUsers } from "@/components/hooks/useAllUsers "

import { useChats } from "../../hooks/useChats"
import { IChat } from "../../types"

type Props = {
  handleForward: (id: string, type: string) => void
}

const ForwardMessage = ({ handleForward }: Props) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)

  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)

  const { users, loading: usersLoading } = useAllUsers({ searchValue })
  const { chats, loading: chatsLoading } = useChats({ searchValue })

  const userList = users ? users : []
  const chatList = chats ? chats : []

  const filterChat = (currentUser: IUser, participantUser: IUser) => {
    return chatList.find(
      (chat: IChat) =>
        chat.type === "direct" &&
        chat.participantUsers.length === 2 &&
        chat.participantUsers.some(
          (participant) =>
            participant._id === currentUser._id ||
            participant._id === participantUser._id
        )
    )
  }

  const filteredChats = chatList.filter(
    (chat: IChat) =>
      chat.type !== "direct" ||
      !filterChat(currentUser, chat.participantUsers[0])
  )

  const forwardList =
    !usersLoading && !chatsLoading
      ? [...userList, ...filteredChats].map((list) => {
          const _id = list._id
          const type = list.type || "direct"
          const avatar = list.participantUsers
            ? list.participantUsers[0].details.avatar
            : list?.details?.avatar || ""
          const fullName = list.name
            ? list.name
            : list.participantUsers
            ? list.participantUsers[0].details.fullName
            : list.details?.fullName
            ? list.details?.fullName
            : list.email
          const position = list.details?.position || ""

          return {
            _id,
            type,
            avatar,
            fullName,
            position,
          }
        })
      : []

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value)
  }

  const renderForwardMessage = () => {
    if (usersLoading && chatsLoading) {
      return <Loader />
    }

    return (
      <div className="flex flex-col gap-3 items-start w-full px-10">
        <div className="flex gap-1 py-3 px-4 border border-[#0000001F] rounded-lg w-full">
          <input
            value={searchValue}
            autoFocus
            type="text"
            placeholder="Search..."
            className="outline-none bg-transparent w-full"
            autoComplete="off"
            onChange={handleInputChange}
          />
          <Search size={16} />
        </div>
        <div className="py-2 text-left">Recent</div>
        <div className="flex flex-col pb-4 gap-4 w-full">
          {forwardList.slice(0, 5)?.map((list: any, index: number) => (
            <div className="flex justify-between" key={index}>
              <div className="flex gap-2">
                <Image
                  src={list.avatar ? list.avatar : "/avatar-colored.svg"}
                  alt="avatar"
                  width={60}
                  height={60}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col gap-1 items-start justify-center">
                  <div className="font-medium text-[16px]">
                    {list.fullName ? list.fullName : ""}
                  </div>
                  {list.position && (
                    <div className="font-medium text-[12px] text-[#656565]">{`(${list.position})`}</div>
                  )}
                </div>
              </div>
              <button
                className="py-2 px-3 bg-[#4F33AF] items-end rounded-md text-[#fff]"
                onClick={() => handleForward(list._id, list.type)}
                disabled={true}
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild={true}>
        <div className="p-2.5 bg-[#F2F2F2] rounded-full cursor-pointer">
          <MoveLeft size={16} />
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 gap-0 h-[500px] max-w-md max-h-[640px] items-start">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="flex justify-around py-3">
            Forward Chat
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-6 ">{renderForwardMessage()}</div>
      </DialogContent>
    </Dialog>
  )
}

export default ForwardMessage
