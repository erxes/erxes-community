"use client"

import dynamic from "next/dynamic"

const Posts = dynamic(() => import("./Posts"))

const Feed = () => {
  return <Posts />
}

export default Feed
