import { queries } from "@/common/team/graphql"
import { IUser } from "@/modules/auth/types"
import { useQuery } from "@apollo/client"

export interface IUseFeedDetail {
  loading: boolean
  users: IUser[]
}

export const useAllUsers = ({
  userIds = [],
  searchValue,
  reload,
}: {
  userIds?: string[]
  searchValue?: string
  reload?: boolean
}): IUseFeedDetail => {
  const { data: usersData, loading } = useQuery(queries.users, {
    variables: {
      ids: userIds,
      searchValue,
      excludeIds: reload,
    },
  })

  const { users } = usersData || {}

  return {
    loading,
    users,
  }
}
