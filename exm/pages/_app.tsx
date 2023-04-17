import "react-select-plus/dist/react-select-plus.css";
import "../styles/globals.css";

import AppProvider, { AppConsumer } from "../modules/appContext";

import { ApolloProvider } from "@apollo/client";
import React from "react";
import Script from "../modules/common/Script";
import withApolloClient from "./api/lib/withApolloClient";

type Props = {
  pageProps: any;
  Component: any;
  apolloClient: any;
  router: any;
};

function MyApp({ Component, pageProps, apolloClient, router }: Props) {
  return (
    <ApolloProvider client={apolloClient}>
      <AppProvider>
        <AppConsumer>
          {({ currentUser }: any) => {
            return (
              <Component
                {...pageProps}
                router={router}
                currentUser={currentUser}
              />
            );
          }}
        </AppConsumer>
      </AppProvider>
    </ApolloProvider>
  );
}

export default withApolloClient(MyApp);
