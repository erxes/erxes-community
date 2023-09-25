"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { usePosts } from "../hooks/usePosts"
import PostItem from "./PostItem"

const Posts = () => {
  const { posts, postsCount, loading, handleLoadMore } = usePosts()

  if (loading) {
    return <></>
  }

  if (!posts || postsCount === 0) {
    return <div>empty p</div>
  }

  return (
    <ScrollArea className="w-full">
      <div>
        {posts.map((post) => {
          return <PostItem key={post._id} postId={post._id} />
        })}
      </div>
    </ScrollArea>
  )
}

export default Posts
