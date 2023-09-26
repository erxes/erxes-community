import { useQuery } from "@apollo/client"

import { queries } from "../graphql"

export interface IUseChats {
  loading: boolean
  chats: any
  chatsCount: number
  handleLoadMore: () => void
}

export const useChats = (): IUseChats => {
  const { data, loading, fetchMore } = useQuery(queries.chats, {
    variables: { limit: 20 },
  })

  const handleLoadMore = () => {
    const chatLength = data.chats.list.length || 0

    fetchMore({
      variables: {
        skip: chatLength,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) {
          return prev
        }

        const fetchedChats = fetchMoreResult.chats.list || []

        const prevChats = prev.chats.list || []

        if (fetchedChats) {
          return {
            ...prev,
            chats: {
              ...prev.chats,
              list: [...prevChats, ...fetchedChats],
            },
          }
        }
      },
    })
  }

  const chats = (data || {}).chats ? (data || {}).chats.list : []
  const chatsCount = (data || {}).chats ? (data || {}).chats.totalCount : 0

  return {
    loading,
    chats,
    chatsCount,
    handleLoadMore,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
