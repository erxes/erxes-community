"use client"

import PostItem from "../PostItem"

const PostDetail = ({ postId }: { postId: string }) => {
  return <PostItem postId={postId} />
}

export default PostDetail
