import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

import { getEnv } from "@/lib/utils"

const env = getEnv()

const httpLink: any = new HttpLink({
  uri: `${env.NEXT_PUBLIC_SERVER_API_DOMAIN}/graphql`,
})

const client = new ApolloClient({
  ssrMode: typeof window !== "undefined",
  cache: new InMemoryCache(),
  link: httpLink,
})

export default client
