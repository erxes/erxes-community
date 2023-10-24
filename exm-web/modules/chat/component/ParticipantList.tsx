"use client"

import { useState } from "react"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { useAtomValue } from "jotai"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LoadingPost from "@/components/ui/loadingPost"
import SelectUsers from "@/components/select/SelectUsers"

import useChatsMutation from "../hooks/useChatsMutation"
import { IChat } from "../types"
import ParticipantItem from "./ParticipantItem"

const ParticipantList = ({ chat }: { chat: IChat }) => {
  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)
  const [userIds, setUserIds] = useState([] as any)
  const [open, setOpen] = useState(false)

  const callBack = (result: string) => {
    if (result === "success") {
      setOpen(false)
    }
  }

  const { addOrRemoveMember, loading: mutationLoading } = useChatsMutation({
    callBack,
  })

  const addMember = () => {
    setUserIds([])
    addOrRemoveMember(chat._id, "add", userIds)
  }

  const isAdmin =
    (chat?.participantUsers || []).find(
      (pUser) => pUser._id === currentUser._id
    )?.isAdmin || false

  const renderAdd = () => {
    const renderForm = () => {
      return (
        <DialogContent className="p-0 gap-0 max-w-md">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex justify-around">
              Add people
            </DialogTitle>
          </DialogHeader>

          {mutationLoading ? <LoadingPost text="Adding" /> : null}

          <div className="p-6">
            <SelectUsers userIds={userIds} onChange={setUserIds} />

            <div className="flex gap-3 mt-6">
              <Button
                className="rounded-lg w-full bg-[#E6E6E6] text-[#444] hover:bg-[#F0F0F0]"
                onClick={() => setOpen(!open)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-lg w-full bg-primary-light"
                onClick={addMember}
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      )
    }

    return (
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild={true}>
          <div className="p-3 cursor-pointer bg-primary-light rounded-lg">
            <p className="text-sm font-medium text-white w-full text-center">
              Add People
            </p>
          </div>
        </DialogTrigger>

        {open ? renderForm() : null}
      </Dialog>
    )
  }

  return (
    <>
      <div className="px-6 pt-6 max-h-[70vh] overflow-auto">
        <div className="">
          {chat.participantUsers.map((user: any, index: number) => (
            <ParticipantItem
              key={index}
              participant={user}
              chatId={chat._id}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
      <div className="px-6 pb-6">{isAdmin && renderAdd()}</div>
    </>
  )
}

export default ParticipantList
