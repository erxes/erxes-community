"use client"

import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { useAtomValue } from "jotai"
import { PlusIcon, ShieldOffIcon, UserPlus2Icon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import useChatsMutation from "../hooks/useChatsMutation"
import { IChat } from "../types"
import ParticipantItem from "./ParticipantItem"

const ParticipantList = ({ chat }: { chat: IChat }) => {
  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)

  const { makeOrRemoveAdmin, addOrRemoveMember } = useChatsMutation()

  const isAdmin =
    (chat?.participantUsers || []).find(
      (pUser) => pUser._id === currentUser._id
    )?.isAdmin || false

  const adminMutation = () => {
    makeOrRemoveAdmin(chat._id, "")
  }

  const userMutation = () => {
    addOrRemoveMember(chat._id, "")
  }

  const renderAdd = () => {
    const renderForm = () => {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create bravo</DialogTitle>
          </DialogHeader>
        </DialogContent>
      )
    }

    return (
      <Dialog>
        <DialogTrigger asChild={true}>
          <div className="flex items-center mb-2 p-2 hover:bg-[#F0F0F0] cursor-pointer">
            <div className="p-2 bg-[#F0F0F0] rounded-full cursor-pointer mr-2">
              <PlusIcon size={18} />
            </div>
            <div className="">
              <p className="text-sm font-medium text-[#444]">Add member</p>
            </div>
          </div>
        </DialogTrigger>

        {renderForm()}
      </Dialog>
    )
  }

  const renderActionButtons = () => {
    if (!isAdmin) {
      return null
    }

    return (
      <div className="flex">
        <div
          className="p-2 bg-[#F0F0F0] rounded-full cursor-pointer mr-2 z-10"
          onClick={adminMutation}
        >
          <ShieldOffIcon size={18} />
        </div>
        <div
          className="p-2 bg-[#F0F0F0] rounded-full cursor-pointer mr-2 z-10"
          onClick={userMutation}
        >
          <UserPlus2Icon size={18} />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      {chat.participantUsers.map((user: any, index: number) => (
        <ParticipantItem
          key={index}
          participant={user}
          chatId={chat._id}
          isAdmin={isAdmin}
        />
      ))}

      {isAdmin && renderAdd()}
    </div>
  )
}

export default ParticipantList
