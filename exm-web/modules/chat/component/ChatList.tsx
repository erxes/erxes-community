"use client"

import { PenSquareIcon } from "lucide-react"

import { Card } from "@/components/ui/card"

import { useChats } from "../hooks/useChats"

export const ChatList = () => {
  const { posts, postsCount, loading, handleLoadMore } = useChats()

  return (
    <>
      <div className="flex items-center justify-between p-6">
        <h3 className="text-2xl font-semibold">Chats</h3>
        <div className="p-4 bg-[#F0F0F0] rounded-full">
          <PenSquareIcon size={18} />
        </div>
      </div>
      <div className="mt-4">
        <Card className="px-6 rounded-none py-2.5 cursor-pointer flex items-center shadow-none border-none bg-transparent hover:bg-[#F0F0F0]">
          <div className="rounded-full bg-black h-9 w-9 mr-4" />
          <div className="text-sm text-[#444] w-full">
            <p className="">Gerelsukh</p>
            <div className="flex justify-between w-full text-xs font-medium">
              <p className="">bn uu</p>
              <p className="">5 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
