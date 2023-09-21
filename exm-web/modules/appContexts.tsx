'use client';

import React, { createContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { CurrentUserQueryResponse } from './auth/types';
import queries from './auth/graphql/queries';

const AppContext = createContext({});

export const AppConsumer = AppContext.Consumer;

type Props = {
  children: any;
};

function AppProvider({ children }: Props) {
  const { data, loading } = useQuery<CurrentUserQueryResponse>(
    gql(queries.currentUser),
    {
      fetchPolicy: 'network-only'
    }
  );

  if (loading) {
    console.log('123123');
    return 'spinner';
  }

  console.log(data, 'data');

  const currentUser = data?.currentUser || '123123';

  console.log(currentUser, '2313312312212');

  return (
    <AppContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
