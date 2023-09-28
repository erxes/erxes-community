import { ApolloError, useMutation } from "@apollo/client"

import { useToast } from "@/components/ui/use-toast"

import { mutations } from "../graphql"
import { IFeed } from "../types"

const useFeedMutation = () => {
  const { toast } = useToast()

  const onError = (error: ApolloError) => {
    toast({ description: error.message, variant: "destructive" })
  }

  const [feedAdd, { loading }] = useMutation(mutations.addFeed, {
    onCompleted(data) {
      toast({ description: "added", variant: "destructive" })
    },
    refetchQueries: ["feed"],
    onError,
  })

  const [feedEdit, { loading: loadingEdit }] = useMutation(mutations.editFeed, {
    onCompleted(data) {
      toast({ description: "edited", variant: "destructive" })
    },
    refetchQueries: ["feed", "exmFeedDetail"],
    onError,
  })

  const feedMutation = (variables: IFeed, _id?: string) => {
    if (!_id) {
      feedAdd({
        variables,
      }).then(() => {
        toast({ description: "added", variant: "destructive" })
      })
    }

    if (_id) {
      feedEdit({
        variables: { _id, ...variables },
      })
    }
  }

  return {
    feedMutation,
    loading: loading || loadingEdit,
  }
}

export default useFeedMutation
