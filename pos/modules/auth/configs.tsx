"use client"

import { ReactNode, useEffect } from "react"
import {
  configAtom,
  setConfigsAtom,
  setCurrentUserAtom,
} from "@/store/config.store"
import { useQuery } from "@apollo/client"
import { useAtom } from "jotai"
import { Loader2 } from "lucide-react"

import { hexToHsl } from "@/lib/utils"

import { queries } from "./graphql"
import useConfig from "./hooks/useConfig"

const Configs = ({ children }: { children: ReactNode }) => {
  const [, setConfigs] = useAtom(setConfigsAtom)
  const [, setCurrentUser] = useAtom(setCurrentUserAtom)
  const [curConfig, setConfig] = useAtom(configAtom)

  const { loading } = useQuery(queries.posCurrentUser, {
    onCompleted: (data) => {
      setCurrentUser(data.posCurrentUser)
    },
  })

  const { config, loading: loadingConfig } = useConfig("main", {
    onCompleted: (data) => {
      setConfig(data)
    },
    skip: !!curConfig,
  })

  const { loading: loadingConfigs } = useQuery(queries.configs, {
    onCompleted: (data) => {
      setConfigs(data.posclientConfigs)
    },
  })

  const currentConfig = (config || {}).currentConfig
  const { uiOptions } = currentConfig || {}

  const { colors, logo } = uiOptions || {}

  const primary = (colors || {}).primary

  useEffect(() => {
    if (primary) {
      document.documentElement.style.setProperty(
        "--primary",
        hexToHsl(primary || "#4f33af")
      )
    }
  }, [primary])

  if (loading || loadingConfig || loadingConfigs)
    return (
      <div className="flex h-screen  items-center justify-center">
        <Loader2 className="mr-2 animate-spin" /> Уншиж байна...
      </div>
    )

  return <>{children}</>
}

export default Configs
