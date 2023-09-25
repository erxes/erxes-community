import { useQuery } from "@apollo/client"

import { queries } from "../graphql"

export interface IUsePosts {
  loading: boolean
  posts: any
  postsCount: number
  handleLoadMore: () => void
}

export const useChats = (): IUsePosts => {
  const { data, loading, fetchMore } = useQuery(queries.chats, {
    variables: {},
  })

  const handleLoadMore = () => {
    const feedLength = data.exmFeed.list.length || 0

    fetchMore({
      variables: {
        skip: feedLength,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) {
          return prev
        }

        const fetchedExmFeed = fetchMoreResult.exmFeed.list || []

        const prevExmFeed = prev.exmFeed.list || []

        if (fetchedExmFeed) {
          return {
            ...prev,
            exmFeed: {
              ...prev.exmFeed,
              list: [...prevExmFeed, ...fetchedExmFeed],
            },
          }
        }
      },
    })
  }

  const posts = (data || {}).exmFeed ? (data || {}).exmFeed.list : []
  const postsCount = (data || {}).exmFeed ? (data || {}).exmFeed.totalCount : 0

  return {
    loading,
    posts,
    postsCount,
    handleLoadMore,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
