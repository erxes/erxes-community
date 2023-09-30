"use client"

import { useState } from "react"
import Image from "next/image"
import { IUser } from "@/modules/auth/types"
import PostForm from "@/modules/feed/component/form/PostForm"
import { useFeedDetail } from "@/modules/feed/hooks/useFeedDetail"
import dayjs from "dayjs"
import {
  ClockIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PinIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { readFile } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import LoadingCard from "@/components/ui/loading-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AttachmentWithPreview } from "@/components/AttachmentWithPreview"

import BravoForm from "./form/BravoForm"
import EventForm from "./form/EventForm"
import HolidayForm from "./form/HolidayForm"

const PostItem = ({ postId }: { postId: string }) => {
  const [open, setOpen] = useState(false)

  const { feed, loading } = useFeedDetail({ feedId: postId })

  if (loading) {
    return <LoadingCard />
  }

  const user = feed.createdUser || ({} as IUser)
  const userDetail = user.details

  const images = [
    { image: "/user.png" },
    { image: "/user.png" },
    { image: "/user.png" },
    { image: "/user.png" },
  ]

  const urlRegex = /(https?:\/\/[^\s]+)/g

  let links: string[] = []
  let updatedDescription = ""

  if (feed.description) {
    const matches = feed.description.match(urlRegex)

    if (matches) {
      updatedDescription = matches.reduce(
        (prevDescription: string, link: string) =>
          prevDescription.replace(link, ""),
        feed.description
      )

      links = matches
    } else {
      updatedDescription = feed.description
    }
  }

  let gridCols = ""

  switch (images.length) {
    case 1:
      gridCols = "col-span-1"
      break
    case 2:
      gridCols = "col-span-1"
      break
    case 3:
      gridCols = "col-span-3"
      break
    case 4:
      gridCols = "col-span-4"
      break

    default:
      gridCols = "col-span-2"
      break
  }

  const editAction = () => {
    const renderForm = () => {
      switch (feed.contentType) {
        case "post":
          return <PostForm feed={feed} setOpen={setOpen} />
        case "publicHoliday":
          return <HolidayForm feed={feed} setOpen={setOpen} />
        case "welcome":
          return null
        case "bravo":
          return <BravoForm feed={feed} setOpen={setOpen} />
        case "event":
          return <EventForm feed={feed} setOpen={setOpen} />
      }
    }

    return (
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild={true}>
          <div className="text-black">edit</div>
        </DialogTrigger>

        {renderForm()}
      </Dialog>
    )
  }

  const renderFeedActions = () => {
    return (
      <Popover>
        <PopoverTrigger asChild={true}>
          <div className="p-2 bg-white rounded-full">
            <MoreHorizontalIcon size={16} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-3">
          <div className="hover:bg-[#F0F0F0] p-2 rounded-md cursor-pointer text-[#444] text-xs">
            {editAction()}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const renderEventInfo = () => {
    const { eventData } = feed

    return (
      <div className="text-[#444]">
        <div className="flex items-center mb-2">
          <ClockIcon size={18} className="mr-1" />
          {dayjs(eventData?.startDate).format("MM/DD/YYYY h:mm A")} ~{" "}
          {dayjs(eventData?.endDate).format("MM/DD/YYYY h:mm A")}
        </div>
        <div className="flex items-center mb-2">
          <UsersIcon size={18} className="mr-1" />
          <b>{eventData?.goingUserIds.length}</b>&nbsp;Going •&nbsp;
          <b>{eventData?.interestedUserIds?.length}</b>&nbsp;Interested
        </div>
        <div className="flex items-center mb-2">
          <UserIcon size={18} className="mr-1" />
          Event by{" "}
          {feed?.createdUser?.details?.fullName ||
            feed?.createdUser?.username ||
            feed?.createdUser?.email}
        </div>
        <div className="flex items-center mb-2">
          <MapPinIcon size={18} className="mr-1" />
          {eventData?.where || ""}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto my-4 border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={
                  userDetail.avatar ? readFile(userDetail.avatar) : "/user.png"
                }
                alt="User Profile"
                width={500}
                height={500}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <div className="text-sm font-bold text-gray-700 mb-1">
                  {userDetail.fullName ||
                    userDetail.username ||
                    userDetail.email}
                </div>
                <div className="text-xs text-[#666] font-normal">
                  {dayjs(feed.createdAt).format("MM/DD/YYYY h:mm A")}{" "}
                  <span className="text-green-700 font-bold text-sm ml-1">{`#${feed.contentType}`}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {feed.isPinned && <PinIcon size={18} color={"#FF0000"} />}
              {renderFeedActions()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4">
            <div className="text-sm font-semibold text-slate-800">
              <b className="text-[#444] text-base font-bold">{feed.title}</b>
            </div>
            <div className="my-1">
              <p className="text-[#666]">{updatedDescription}</p>
            </div>
            {feed.contentType === "event" && renderEventInfo()}
            {links.map((link, index) => {
              return (
                <iframe
                  key={index}
                  width="640"
                  height="390"
                  src={String(link)
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "youtube.com/embed/")
                    .replace("share/", "embed/")}
                  title="Video"
                  allowFullScreen={true}
                />
              )
            })}
          </div>

          {(feed.attachments || []).map((a, index) => {
            return (
              <a key={index} href={readFile(a.url)}>
                <div className="flex items-center border-y text-sm font-semibold text-[#444] p-2.5">
                  {a.name} <ExternalLinkIcon size={18} />
                </div>
              </a>
            )
          })}

          {feed.images && feed.images.length > 0 && (
            <AttachmentWithPreview images={feed.images} className="mt-2" />
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default PostItem
