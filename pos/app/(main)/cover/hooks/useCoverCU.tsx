import { useParams } from "next/navigation"
import { useMutation } from "@apollo/client"

import { useToast } from "@/components/ui/use-toast"

import { mutations, queries } from "../graphql"

const useCoverCU = () => {
  const { id } = useParams()
  const { onError } = useToast()

  const [createCover, { loading }] = useMutation(mutations.coversAdd, {
    onError,
    refetchQueries: [{ query: queries.covers }, "Covers"],
  })

  const [editCover, { loading: loadingEdit }] = useMutation(
    mutations.coversEdit,
    {
      onError,
      refetchQueries: [
        { query: queries.covers },
        "Covers",
        { query: queries.coverDetail },
        "CoverDetail",
      ],
    }
  )

  const coverCU = id && id !== "create" ? editCover : createCover

  return { coverCU, loading: loading || loadingEdit }
}

export default useCoverCU
