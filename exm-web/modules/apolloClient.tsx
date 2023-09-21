'use client';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  ApolloProvider
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

console.log(process.env.ERXES_API_URL);

const httpLink: any = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_ERXES_API_URL}/graphql`,
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_ERXES_API_URL}/graphql`
    }
  };
});

const wsLink: any =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_MAIN_SUBS_DOMAIN || ''
        })
      )
    : null;

const httpLinkWithMiddleware = authLink.concat(httpLink);

type Definintion = {
  kind: string;
  operation?: string;
};
const splitLink =
  typeof window !== 'undefined'
    ? split(
        ({ query }) => {
          const { kind, operation }: Definintion = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLinkWithMiddleware
      )
    : httpLinkWithMiddleware;

const client = new ApolloClient({
  ssrMode: typeof window !== 'undefined',
  cache: new InMemoryCache(),
  link: splitLink
});

const Provider = ({ children }: any) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
