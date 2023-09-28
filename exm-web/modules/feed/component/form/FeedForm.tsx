"use client"

import Image from "next/image"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { useAtomValue } from "jotai"

import { readFile } from "@/lib/utils"
import { Card, CardHeader } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import BravoForm from "./BravoForm"
import EventForm from "./EventForm"
import HolidayForm from "./HolidayForm"
import PostForm from "./PostForm"

const FeedForm = ({ contentType }: { contentType: string }) => {
  const currentUser = useAtomValue(currentUserAtom)

  const userDetail = currentUser?.details || {}

  const renderForm = () => {
    switch (contentType) {
      case "post":
        return <PostForm />
      case "publicHoliday":
        return <HolidayForm />
      case "welcome":
        return null
      case "bravo":
        return <BravoForm />
      case "event":
        return <EventForm />
    }
  }

  return (
    <>
      <Dialog>
        <div className="w-full">
          <Card className="max-w-2xl mx-auto my-4 border-0">
            <CardHeader className="flex">
              <div className="flex items-center">
                <Image
                  src={
                    userDetail.avatar
                      ? readFile(userDetail.avatar)
                      : "/user.png"
                  }
                  alt="User Profile"
                  width={500}
                  height={500}
                  className="w-10 h-10 rounded-full"
                />
                <div className="w-full ml-4">
                  <DialogTrigger asChild={true}>
                    <div>
                      <Input
                        className="border-sm rounded-full"
                        placeholder="Write a post"
                      />
                    </div>
                  </DialogTrigger>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {renderForm()}
      </Dialog>
    </>
  )
}

export default FeedForm
