import React from "react"
import { ChevronLeft } from "lucide-react"

import Image from "@/components/ui/image"

type Props = {
  chatDetail: any
}

const MessagesHeader = ({ chatDetail }: Props) => {
  return (
    <>
      <div className={`flex gap-2 items-center`}>
        <div className="relative shrink-0 w-[60px] h-[60px]">
          {chatDetail.type === "direct" ? (
            <Image
              src={
                chatDetail.participantUsers[0].details.avatar
                  ? chatDetail.participantUsers[0].details.avatar
                  : "/avatar-colored.svg"
              }
              alt="avatar"
              width={100}
              height={100}
              className="bg-blue-200 w-[60px] h-[60px] rounded-full object-cover ring-1 ring-black"
            />
          ) : (
            chatDetail.participantUsers
              ?.slice(0, 2)
              ?.map((participant: any, index: number) => (
                <Image
                  key={index}
                  src={
                    participant.details.avatar
                      ? participant.details.avatar
                      : "/avatar-colored.svg"
                  }
                  alt="avatar"
                  width={100}
                  height={100}
                  className={`absolute top-${index * 4} right-${
                    index * 6
                  } w-[40px] h-[40px] rounded-full object-cover ring-1 ring-black`}
                />
              ))
          )}
          <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#fff]">
            <div className="bg-green-400 h-3 w-3 rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-[16px]">
            {chatDetail.type === "direct"
              ? chatDetail
                ? chatDetail.participantUsers[0].details.fullName
                : ""
              : chatDetail.name}
          </div>
          <div className="text-[12px] text-green-400">Active Now</div>
        </div>
      </div>
      <button className="bg-gray-200 rounded-full p-1">
        <ChevronLeft size={16} />
      </button>
    </>
  )
}

export default MessagesHeader
