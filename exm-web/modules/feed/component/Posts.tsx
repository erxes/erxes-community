"use client"

import { useEffect } from "react"
import { InView, useInView } from "react-intersection-observer"

import { Button } from "@/components/ui/button"
import { LoaderIcon } from "@/components/ui/loader"

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
    return <></>
  }

  if (!posts || postsCount === 0) {
    return <div>empty p</div>
  }

  return (
    <div ref={ref} className="w-full pr-3 h-screen overflow-auto pb-10">
      {posts.map((post) => {
        return <PostItem key={post._id} postId={post._id} />
      })}
      {!loading && postsCount > 20 && posts.length < postsCount && (
        <div className="max-w-2xl mx-auto my-4 bg-white border-light border-gray-300">
          <Button
            className="max-w-2xl mx-auto my-4 bg-white border-light border-none"
            ref={ref}
            variant="outline"
          />
        </div>
      )}
    </div>
  )
}

export default Posts
