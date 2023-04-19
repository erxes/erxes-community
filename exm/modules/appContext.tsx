import React, { createContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import { CurrentUserQueryResponse } from "./auth/types";
import queries from "./auth/graphql/queries";

const AppContext = createContext({});

export const AppConsumer = AppContext.Consumer;

type Props = {
  children: any;
};

function AppProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = React.useState(null);

  const userQuery = useQuery<CurrentUserQueryResponse>(
    gql(queries.currentUser)
  );

  useEffect(() => {
    if (userQuery.data && userQuery.data.currentUser) {
      setCurrentUser(userQuery.data.currentUser);
    }
  }, [userQuery, currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
