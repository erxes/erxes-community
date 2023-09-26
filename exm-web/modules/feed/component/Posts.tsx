"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import LoadingCard from "@/components/ui/loading-card"

import { usePosts } from "../hooks/usePosts"
import PostItem from "./PostItem"

const Posts = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const { posts, postsCount, loading, handleLoadMore } = usePosts()

  useEffect(() => {
    if (inView) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore])

  if (loading) {
    return <LoadingCard />
  }

  if (!posts || postsCount === 0) {
    return <div>empty p</div>
  }

  return (
    <div className="w-full pr-3 h-screen overflow-auto pb-10">
      {posts.map((post) => {
        return <PostItem key={post._id} postId={post._id} />
      })}
      {!loading && postsCount > 20 && posts.length < postsCount && (
        <div ref={ref}>
          <LoadingCard />
        </div>
      )}
    </div>
  )
}

export default Posts
