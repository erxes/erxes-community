"use client"

import Image from "next/image"
import { IUser } from "@/modules/auth/types"

import { formatDate, readFile } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import LoadingCard from "@/components/ui/loading-card"

import { useFeedDetail } from "../../hooks/useFeedDetail"

const EventDetail = ({ postId }: { postId: string }) => {
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

  return (
    <>
      <Card className="max-w-2xl mx-auto my-4 border-0">
        <CardHeader>
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
        <CardContent className="px-2 pb-2 items-center ">
          {/* <Icon className="mr-1 h-5 w-5 text-slate-800" strokeWidth={1.9} /> */}
          <div className="text-sm font-semibold text-slate-800">
            {feed.title}
          </div>
          <div className="mt-2">
            <p>{feed.description}</p>
          </div>
          <div className={`grid grid-cols-2 my-4`}>
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image.image}
                  alt={`Post ${index}`}
                  width={500}
                  height={500}
                  className={`h-32 w-full object-cover ${gridCols}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex px-2 pb-2 items-center">
          <div className="text-sm font-semibold text-slate-800">
            {feed.title}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default EventDetail
