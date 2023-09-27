import { useSearchParams } from "next/navigation"
import { useQuery } from "@apollo/client"

import { queries } from "../graphql"

export interface IUseChats {
  loading: boolean
  chatMessages: any
  handleLoadMore: () => void
}

export const useChatMessages = (): IUseChats => {
  const searchParams = useSearchParams()

  const id = searchParams.get("id") as string

  const { data, loading, fetchMore } = useQuery(queries.chatMessages, {
    variables: { chatId: id, skip: 0 },
  })

  const chatDetailQuery = useQuery(queries.chatDetail, {
    variables: { id },
  })

  const handleLoadMore = () => {
    const chatLength = data.chatMessages.list.length || 0

    fetchMore({
      variables: {
        skip: chatLength,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) {
          return prev
        }

        const fetchedChatMessages = fetchMoreResult.chatMessages.list || []

        const prevChatMessages = prev.chatMessages.list || []

        if (fetchedChatMessages) {
          return {
            ...prev,
            chatMessages: {
              ...prev.chatMessages,
              list: [...prevChatMessages, ...fetchedChatMessages],
            },
          }
        }
      },
    })
  }

  const chatMessages = (data || {}).chatMessages
    ? (data || {}).chatMessages.list
    : []

  return {
    loading,
    chatMessages,
    handleLoadMore,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
