import { useMutation, useQuery } from "@apollo/client"

import { mutations, queries } from "../graphql"

export interface IUsePosts {
  loadingReaction: boolean
  reactionMutation: (contentId: string) => void
}

export const useReactionMutaion = (): IUsePosts => {
  const [reactionAdd, { loading: loadingReaction }] = useMutation(
    mutations.emojiReact,
    {
      refetchQueries: ["emojiCount", "emojiIsReacted"],
    }
  )

  const reactionMutation = (contentId: string) => {
    reactionAdd({
      variables: { contentId, contentType: "exmFeed", type: "heart" },
    })
  }

  // const events = (data || {}).exmFeed ? (data || {}).exmFeed.list : []

  return {
    reactionMutation,
    loadingReaction,
  }
}
