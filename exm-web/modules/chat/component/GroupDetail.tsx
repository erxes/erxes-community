"use client"

import { useState } from "react"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { useAtomValue } from "jotai"
import {
  Bell,
  BellOff,
  ChevronRight,
  Link,
  LogOut,
  PlusCircle,
} from "lucide-react"

import { readFile } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import Image from "@/components/ui/image"
import { useToast } from "@/components/ui/use-toast"

import { AttachmentWithPreview } from "../../../components/AttachmentWithPreview"
import useChatsMutation from "../hooks/useChatsMutation"
import ParticipantList from "./ParticipantList"
import { GroupChatAction } from "./form/GroupChatAction"
import { PinnedMessages } from "./messages/PinnedMessages"

const UserDetail = ({ chatDetail }: { chatDetail: any }) => {
  const { toast } = useToast()
  const callBack = (result: string) => {
    if (result === "success") {
      return toast({
        description: chatDetail.muteUserIds.includes(currentUser?._id)
          ? "Unmuted chat"
          : `Muted chat`,
      })
    }
  }
  const { toggleMute } = useChatsMutation({ callBack })
  const [openPin, setOpenPin] = useState(false)
  const [openMembers, setOpenMembers] = useState(false)
  const [openChangeName, setOpenChangeName] = useState(false)
  const [openChangeImage, setOpenChangeImage] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const currentUser = useAtomValue(currentUserAtom)

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index)
  }

  const renderFileSize = (size: number) => {
    if (size > 1000000) {
      return <>({Math.round(size / 1000000)}MB)</>
    }
    if (size > 1000) {
      return <>({Math.round(size / 1000)}kB)</>
    }
  }

  const renderPinnedMessage = () => {
    return (
      <Dialog open={openPin} onOpenChange={() => setOpenPin(!openPin)}>
        <DialogTrigger asChild={true}>
          <div className="flex justify-between cursor-pointer text-black text-sm my-5">
            View pinned messages
            <ChevronRight size={18} />
          </div>
        </DialogTrigger>

        <PinnedMessages />
      </Dialog>
    )
  }

  const renderChatImage = (size?: string) => {
    if (chatDetail && chatDetail.featuredImage.length > 0) {
      return (
        <Image
          src={chatDetail.featuredImage[0]?.url}
          alt="avatar"
          width={60}
          height={60}
          className={`${
            size === "small" ? "w-12 h-12" : "w-20 h-20"
          } rounded-full object-cover border-primary border`}
        />
      )
    }

    return (
      <div className="relative">
        <Image
          src={
            chatDetail.participantUsers[0].details?.avatar ||
            "/avatar-colored.svg"
          }
          alt="avatar"
          width={60}
          height={60}
          className={`${
            size === "small" ? "w-[25px] h-[25px]" : "w-[50px] h-[50px]"
          } rounded-full object-cover absolute right-0 border-primary border`}
        />
        <Image
          src={
            chatDetail.participantUsers[1].details?.avatar ||
            "/avatar-colored.svg"
          }
          alt="avatar"
          width={60}
          height={60}
          className={`${
            size === "small"
              ? "w-[25px] h-[25px] top-[14px]"
              : "w-[50px] h-[50px] top-[28px]"
          } rounded-full object-cover absolute  border-primary border`}
        />
      </div>
    )
  }

  const renderMembers = () => {
    const memberNames = chatDetail.participantUsers.map(
      (user: IUser) => (user.details.fullName || user.email) + ","
    )

    return (
      <Dialog
        open={openMembers}
        onOpenChange={() => setOpenMembers(!openMembers)}
      >
        <DialogTrigger asChild={true}>
          <div className="flex justify-between cursor-pointer text-black text-sm items-center">
            <div className="flex">
              <div className="w-10 h-10 mr-3">{renderChatImage("small")}</div>
              <div>
                <p>{chatDetail.participantUsers.length} members</p>
                <p className="truncate w-[150px] text-[#65676B] text-[12px]">
                  {memberNames}
                </p>
              </div>
            </div>
            <ChevronRight size={18} />
          </div>
        </DialogTrigger>

        <DialogContent className="p-0 gap-0 max-w-md">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex justify-around">
              {chatDetail.participantUsers.length} Members
            </DialogTitle>
          </DialogHeader>
          <ParticipantList chat={chatDetail} />
        </DialogContent>
      </Dialog>
    )
  }

  const renderDatas = (type: string, item: any) => {
    if (type === "link") {
      return (
        <a href={item.src} target="_blank" className="flex mb-4 items-center">
          <div className="p-2 rounded-lg bg-[#ABABAB] mr-2">
            <Link size={15} className="text-white" />
          </div>
          <div className="flex flex-col text-[#707070]">{item.src}</div>
        </a>
      )
    }

    return (
      <a
        href={readFile(item.url)}
        download={true}
        className="flex mb-4 items-center"
      >
        <div className="p-2 rounded-lg bg-[#ABABAB] mr-2">
          <Link size={15} className="text-white" />
        </div>
        <div className="flex flex-col text-[#707070]">
          <p>{item.name}</p>
          <p className="text-xs">{renderFileSize(item.size)}</p>
        </div>
      </a>
    )
  }

  const attachments = [
    {
      _id: "6537493773b63c941c44f033",
      url: "0.7998292006692962Screenshot2023-10-17at12.17.32.png",
      name: "Screenshot 2023-10-17 at 12.17.32.png",
      size: 772101,
      type: "image/png",
    },
    {
      _id: "6537493773b63c941c44f032",
      url: "0.976131914500465Screenshot2023-10-19at17.51.45.png",
      name: "Screenshot 2023-10-19 at 17.51.45.png",
      size: 4384,
      type: "image/png",
    },
    {
      _id: "6537493773b63c941c44f031",
      url: "0.2742031156384068Screenshot2023-10-19at17.57.12.png",
      name: "Screenshot 2023-10-19 at 17.57.12.png",
      size: 4034,
      type: "image/png",
    },
    {
      _id: "6537493773b63c941c44f030",
      url: "0.12714214593478235Screenshot2023-10-19at17.57.17.png",
      name: "Screenshot 2023-10-19 at 17.57.17.png",
      size: 3997,
      type: "image/png",
    },
    {
      _id: "6537493773b63c941c4",
      url: "https://images.unsplash.com/photo-1697909623126-e2ecf6f66869?auto=format&fit=crop&q=80&w=2667&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Screenshot 2023-10-19 at 17.57.17.png",
      size: 3997,
      type: "image/png",
    },
  ]

  const renderMedia = () => {
    return (
      <div className="grid grid-cols-2 gap-3 shared-files-max-height">
        {attachments.map((att, index) => (
          <Dialog key={att._id}>
            <DialogTrigger asChild={true}>
              <div className="cursor-pointer">
                <Image
                  alt="image"
                  src={att.url || ""}
                  width={110}
                  height={90}
                  className="object-cover h-20 rounded-lg"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-0 shadow-none max-w-2xl">
              <DialogHeader />
              <AttachmentWithPreview
                images={attachments || []}
                indexProp={index}
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    )
  }

  const renderFiles = () => {
    return [
      {
        name: "payment.docx",
        size: 32250,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "0.09960727060171326payment.docx",
        _id: "65373ffc73b63c941c44f02e",
      },
      {
        name: "payment.docx",
        size: 32250,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "0.09960727060171326payment.docx",
        _id: "65373ffc73b63c941c44f02e",
      },
      {
        name: "payment.docx",
        size: 32250,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "0.09960727060171326payment.docx",
        _id: "65373ffc73b63c941c44f02e",
      },
    ].map((item) => renderDatas("file", item))
  }

  const renderLinks = () => {
    return [
      { src: "https://office.erxes.io/" },
      { src: "https://fb.com/" },
      { src: "https://www.youtube.com/" },
      { src: "https://github.com/" },
      { src: "https://office.erxes.io/" },
      { src: "https://fb.com/" },
      { src: "https://www.youtube.com/" },
      { src: "https://github.com/" },
      { src: "https://office.erxes.io/" },
      { src: "https://fb.com/" },
      { src: "https://www.youtube.com/" },
      { src: "https://github.com/" },
      { src: "https://office.erxes.io/" },
      { src: "https://fb.com/" },
      { src: "https://www.youtube.com/" },
      { src: "https://github.com/" },
    ].map((item) => renderDatas("link", item))
  }

  const renderSharedFiles = () => {
    return (
      <div>
        <div className="flex mb-4">
          {["Media", "Files", "Links"].map((type, index) => (
            <button
              key={index}
              className={`py-2 px-4 flex-1 bg-[#F2F2F2] rounded-lg ${
                activeTabIndex === index
                  ? "bg-primary-light text-white"
                  : "text-slate-500"
              } ${index !== 2 && "mr-4"}`}
              onClick={() => handleTabClick(index)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="overflow-auto group-shared-files-max-height">
          {activeTabIndex === 0 && renderMedia()}
          {activeTabIndex === 1 && renderFiles()}
          {activeTabIndex === 2 && renderLinks()}
        </div>
      </div>
    )
  }

  const renderNameChangeAction = () => {
    return (
      <Dialog
        open={openChangeName}
        onOpenChange={() => setOpenChangeName(!openChangeName)}
      >
        <DialogTrigger asChild={true}>
          <h3 className="text-xl font-semibold text-[#444] text-center mt-4 mb-6 cursor-pointer">
            {chatDetail.name}
          </h3>
        </DialogTrigger>

        <GroupChatAction
          chat={chatDetail}
          setOpen={setOpenChangeName}
          type="name"
        />
      </Dialog>
    )
  }

  const renderFeatureImageChangeAction = () => {
    return (
      <Dialog
        open={openChangeImage}
        onOpenChange={() => setOpenChangeImage(!openChangeImage)}
      >
        <DialogTrigger asChild={true}>{renderChatImage()}</DialogTrigger>

        <GroupChatAction
          chat={chatDetail}
          setOpen={setOpenChangeImage}
          type="image"
        />
      </Dialog>
    )
  }

  const renderActions = () => {
    const muted = chatDetail.muteUserIds.includes(currentUser?._id)
    return (
      <div className="flex justify-around w-full">
        <div className="flex flex-col items-center">
          <div className="bg-[#E6E6E6] rounded-lg p-3 text-[#9A9A9A] cursor-pointer">
            <PlusCircle size={16} />
          </div>
          Add
        </div>
        <div className="flex flex-col items-center">
          <div
            className="bg-[#E6E6E6] rounded-lg p-3 text-[#9A9A9A] cursor-pointer w-fit"
            onClick={() => toggleMute(chatDetail._id)}
          >
            {muted ? <Bell size={16} /> : <BellOff size={16} />}
          </div>
          {muted ? "Unmute" : "Mute"}
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E6E6E6] rounded-lg p-3 text-[#9A9A9A] cursor-pointer">
            <LogOut size={16} />
          </div>
          Leave
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#F2F2F2] p-1 rounded-full w-fit cursor-pointer">
        <ChevronRight size={18} />
      </div>

      <div className="flex flex-col items-center">
        <div className="items-end flex mr-2">
          <div className="w-20 h-20 rounded-full relative cursor-pointer">
            {renderFeatureImageChangeAction()}
            <div className="indicator bg-success-foreground w-4 h-4 rounded-full border border-white mr-1 absolute bottom-0 right-0" />
          </div>
        </div>

        {renderNameChangeAction()}
        {renderActions()}
      </div>

      <div className="mt-6">
        {renderMembers()}
        {renderPinnedMessage()}
        {renderSharedFiles()}
      </div>
    </>
  )
}

export default UserDetail
