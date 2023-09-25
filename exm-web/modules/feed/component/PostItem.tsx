"use client"

import Image from "next/image"
import { IUser } from "@/modules/auth/types"

import { formatDate, readFile } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useFeedDetail } from "../hooks/useFeedDetail"

const Posts = ({ postId }: { postId: string }) => {
  const { feed, loading } = useFeedDetail({ feedId: postId })

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto my-4 bg-white border-light border-gray-300" />
    )
  }

  const user = feed.createdUser || ({} as IUser)
  const userDetail = user.details

  return (
    <>
      <Card className="max-w-2xl mx-auto my-4 border-none rounded-none">
        <CardHeader>
          <div className="flex items-center">
            <Image
              src={
                userDetail.avatar ? readFile(userDetail.avatar) : "/user.png"
              }
              alt="User Profile"
              width={500}
              height={1000}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <div className="text-sm font-bold text-gray-700">
                {userDetail.fullName || userDetail.username || userDetail.email}
              </div>
              <div className="text-xs text-gray-600">
                {formatDate(feed.createdAt || "")}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex px-2 pb-2 items-center">
          {/* <Icon className="mr-1 h-5 w-5 text-slate-800" strokeWidth={1.9} /> */}
          {/* <div className="text-sm font-semibold text-slate-800">{value}</div> */}
        </CardContent>
      </Card>
    </>
  )
}

export default Posts
