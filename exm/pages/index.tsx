import AuthLayout from "../modules/layout/components/AuthLayout";
import AuthRoutes from "../modules/auth/routes";
import HomeContainer from "../modules/exm/containers/Home";
import React from "react";
import SignIn from "../modules/auth/containers/SignIn";

export default function Home({ currentUser }) {
  console.log("aaa", currentUser);
  if (!currentUser) {
    return <AuthLayout content={<SignIn />} />;
  }

  return <HomeContainer />;
}
