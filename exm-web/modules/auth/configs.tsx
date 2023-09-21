"use client"

import { ReactNode, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { useSetAtom } from "jotai"

import Loader from "@/components/ui/loader"

import { setCurrentUserAtom } from "../JotaiProiveder"
import { queries } from "./graphql"

const Configs = ({ children }: { children: ReactNode }) => {
  const setCurrentUser = useSetAtom(setCurrentUserAtom)

  const { loading, data } = useQuery(queries.currentUser)

  useEffect(() => {
    setCurrentUser(data?.currentUser)
  }, [data, setCurrentUser])

  if (loading) {
    return <Loader className="h-screen" />
  } else {
    return <>{children}</>
  }
}

export default Configs
