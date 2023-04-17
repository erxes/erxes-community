import React, { createContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import { UserQueryResponse } from "./types";
import { clientPortalGetConfig } from "./main/graphql/queries";
import queries from "./user/graphql/queries";

const AppContext = createContext({});

export const AppConsumer = AppContext.Consumer;

type Props = {
  children: any;
};

function AppProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = React.useState(null);

  const userQuery = useQuery<UserQueryResponse>(gql(queries.currentUser));

  useEffect(() => {
    if (userQuery.data && userQuery.data.clientPortalCurrentUser) {
      setCurrentUser(userQuery.data.clientPortalCurrentUser);
    }
  }, [userQuery, currentUser]);

  const response: any = useQuery(gql(clientPortalGetConfig), {});

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
