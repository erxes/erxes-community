import { useQuery } from "@apollo/client"

import { queries } from "../graphql"

const useProductCategories = (): {
  loading: boolean
  categories: {
    _id: string
    name: string
    isRoot: boolean
  }[]
} => {
  const { loading, data } = useQuery(queries.productCategories, {
    variables: { perPage: 1000, parentId: "" },
  })

  const categories = (data || {}).poscProductCategories || []

  return { loading, categories }
}

export default useProductCategories
