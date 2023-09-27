"use client"

import Image from "next/image"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { useAtomValue } from "jotai"

import { readFile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import PostForm from "./PostForm"

const FeedForm = ({ contentType }: { contentType: string }) => {
  const currentUser = useAtomValue(currentUserAtom)

  const userDetail = currentUser?.details || {}

  const renderForm = () => {
    switch (contentType) {
      case "post":
        return <PostForm />
      case "publicHoliday":
        return <PostForm />
      case "welcome":
        return <PostForm />
      case "bravo":
        return <PostForm />
      case "event":
        return <PostForm />
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
                  <DialogTrigger asChild>
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
