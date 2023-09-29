import { useQuery, useSubscription } from "@apollo/client"

import { queries, subscriptions } from "../graphql"

export interface IUseChats {
  loading: boolean
  chats: any
  pinnedChats: any
  chatsCount: number
  handleLoadMore: () => void
}

export const useChats = ({
  searchValue,
}: {
  searchValue?: string
}): IUseChats => {
  const {
    data,
    loading: chatsLoading,
    fetchMore,
  } = useQuery(queries.chats, {
    variables: { limit: 20, searchValue },
  })

  let loading = true

  const { data: pinnedChatsData, loading: pinnedChatsLoading } = useQuery(
    queries.chatsPinned,
    {
      variables: { limit: 20 },
    }
  )

  const handleLoadMore = () => {
    if (loading) {
      return
    }
    const chats = (data || {}).chats ? (data || {}).chats.list : []
    const chatLength = chats.length || 0

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

        console.log(fetchedChats, "12312")

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

  if (!chatsLoading && !pinnedChatsLoading) {
    loading = false
  }

  const chats = (data || {}).chats ? (data || {}).chats.list : []
  const pinnedChats = (pinnedChatsData || {}).chatsPinned
    ? (pinnedChatsData || {}).chatsPinned.list
    : []
  const chatsCount = (data || {}).chats ? (data || {}).chats.totalCount : 0

  return {
    loading,
    chats,
    pinnedChats,
    chatsCount,
    handleLoadMore,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
