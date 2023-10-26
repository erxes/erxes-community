import React, { useState } from "react"
import { Search } from "lucide-react"

import avatar from "@/components/ui/avatar"
import Image from "@/components/ui/image"
import { useAllUsers } from "@/components/hooks/useAllUsers "

import { useChats } from "../../hooks/useChats"

type Props = {
  handleForward: (id: string, type: string) => void
}

const ForwardMessage = ({ handleForward }: Props) => {
  const [searchValue, setSearchValue] = useState("")

  const { users, loading: usersLoading } = useAllUsers({ searchValue })
  const { chats, loading: chatsLoading } = useChats({ searchValue })

  const userList = users ? users : []
  const chatList = chats ? chats : []

  console.log(userList)
  console.log(chatList)

  const forwardList =
    !usersLoading && !chatsLoading
      ? [...userList, ...chatList].map((list) => {
          const _id = list._id
          const type = list.type || "direct"
          const avatar = list?.details?.avatar || ""
          const fullName = list.name
            ? list.name
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

  console.log(forwardList)

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <div className="flex flex-col items-start justify-between w-full px-10">
        <div className="flex gap-1 py-3 px-4 border border-[#0000001F] rounded-lg items-center w-full">
          <input
            value={searchValue}
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
          {forwardList?.map((list: any, index: number) => (
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
                className="p-2 bg-[#4F33AF] items-end rounded-md text-[#fff]"
                onClick={() => handleForward(list._id, list.type)}
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ForwardMessage
