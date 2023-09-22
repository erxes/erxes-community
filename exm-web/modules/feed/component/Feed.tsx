"use client"

import { usePosts } from "../hooks/usePosts"

export const Feed = () => {
  const { posts, postsCount, loading, handleLoadMore } = usePosts()

  return <div>123</div>
}
