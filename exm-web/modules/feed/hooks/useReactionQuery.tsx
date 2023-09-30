import { useQuery } from "@apollo/client"

import { queries } from "../graphql"
import { IFeed } from "../types"

export interface IReactionDetail {
  loading: boolean
  emojiCount: number
}

export const useReactionQuery = ({
  feedId,
}: {
  feedId: string
}): IReactionDetail => {
  const { data, loading } = useQuery(queries.emojiCount, {
    variables: { contentId: feedId, contentType: "exmFeed", type: "heart" },
  })

  const { data: emojiReactedUsers, loading: loadingReactedUsers } = useQuery(
    queries.emojiReactedUsers,
    {
      variables: { contentId: feedId, contentType: "exmFeed", type: "heart" },
    }
  )

  const emojiCount = (data || {}).emojiCount || {}
  return {
    loading,
    emojiCount,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
