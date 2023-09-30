"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { useAtomValue } from "jotai"
import { useInView } from "react-intersection-observer"

import LoadingCard from "@/components/ui/loading-card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useFeeds } from "../hooks/useFeed"
import { IFeed } from "../types"

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
  const currentUser = useAtomValue(currentUserAtom)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const { feeds, feedsCount, loading, handleLoadMore } = useFeeds(contentType)

  const datas = feeds || []

  let pinnedList
  let normalList

  if (contentType === "event") {
    pinnedList = datas.filter(
      (data) =>
        data.isPinned &&
        ((data.eventData?.visibility === "private" &&
          data.recipientIds.includes(currentUser?._id)) ||
          data.eventData?.visibility === "public")
    )
    normalList = datas.filter(
      (data) =>
        !data.isPinned &&
        ((data.eventData?.visibility === "private" &&
          data.recipientIds.includes(currentUser?._id)) ||
          data.eventData?.visibility === "public")
    )
  } else {
    pinnedList = datas.filter((data) => data.isPinned)
    normalList = datas.filter((data) => !data.isPinned)
  }

  const showList = (items: IFeed[]) => {
    return items.map((filteredItem: any) => renderDetail(filteredItem._id))
  }

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore])

  if (loading) {
    return (
      <ScrollArea className="h-screen pb-16 pr-3">
        <FeedForm contentType={contentType} />
        <LoadingCard />
      </ScrollArea>
    )
  }

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
      {showList(pinnedList)}
      {showList(normalList)}

      {loading && (
        <>
          <LoadingCard type="chatlist" />
        </>
      )}

      {feedsCount > 20 && feeds.length < feedsCount && (
        <div ref={ref}>
          <LoadingCard />
        </div>
      )}
    </ScrollArea>
  )
}

export default List
