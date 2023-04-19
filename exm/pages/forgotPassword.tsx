import AuthLayout from "../modules/layout/components/AuthLayout";
import ForgotPassword from "../modules/auth/containers/ForgotPassword";
import React from "react";

export default function ForgotPasswordPage({ currentUser }) {
  console.log("aaa", currentUser);
  return <AuthLayout content={<ForgotPassword />} />;
}
