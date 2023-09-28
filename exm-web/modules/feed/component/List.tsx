"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useInView } from "react-intersection-observer"

import LoadingCard from "@/components/ui/loading-card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useFeeds } from "../hooks/useFeed"

const PostDetail = dynamic(() => import("../component/details/PostDetail"))
const EventDetail = dynamic(() => import("../component/details/EventDetail"))
const BravoDetail = dynamic(() => import("../component/details/BravoDetail"))
const WelcomeDetail = dynamic(
  () => import("../component/details/WelcomeDetail")
)
const HolidayDetail = dynamic(
  () => import("../component/details/HolidayDetail")
)

const FeedForm = dynamic(() => import("../component/form/FeedForm"))

const List = ({ contentType }: { contentType: string }) => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const { feeds, feedsCount, loading, handleLoadMore } = useFeeds(contentType)

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore])

  if (loading) {
    return (
      <>
        <FeedForm contentType={contentType} />
        <LoadingCard />
      </>
    )
  }

  // if (!feeds || feedsCount === 0) {
  //   return <div>Empty</div>
  // }

  const renderDetail = (feedId: string) => {
    switch (contentType) {
      case "post":
        return <PostDetail key={feedId} postId={feedId} />
      case "publicHoliday":
        return <HolidayDetail key={feedId} postId={feedId} />
      case "welcome":
        return <WelcomeDetail key={feedId} postId={feedId} />
      case "bravo":
        return <BravoDetail key={feedId} postId={feedId} />
      case "event":
        return <EventDetail key={feedId} postId={feedId} />
    }
  }

  return (
    <ScrollArea className="h-screen pb-16 pr-3">
      <FeedForm contentType={contentType} />
      {feeds.map((feed) => {
        return renderDetail(feed._id)
      })}
      {!loading && feedsCount > 20 && feeds.length < feedsCount && (
        <div ref={ref}>
          <LoadingCard />
        </div>
      )}
    </ScrollArea>
  )
}

export default List
