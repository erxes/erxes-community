"use client"

import { ReactNode, useEffect } from "react"
import {
  configAtom,
  setConfigsAtom,
  setCurrentUserAtom,
} from "@/store/config.store"
import { useQuery } from "@apollo/client"
import { useSetAtom } from "jotai"
import { Loader2 } from "lucide-react"

import { hexToHsl } from "@/lib/utils"

import { queries } from "./graphql"

const Configs = ({ children }: { children: ReactNode }) => {
  const setConfigs = useSetAtom(setConfigsAtom)
  const setCurrentUser = useSetAtom(setCurrentUserAtom)
  const setConfig = useSetAtom(configAtom)

  const { loading, data } = useQuery(queries.posCurrentUser)

  const { data: config, loading: loadingConfig } = useQuery(
    queries.currentConfig,
    {
      onCompleted(data) {
        console.log(data)
        setConfig(data?.currentConfig)
      },
      fetchPolicy: "network-only",
    }
  )

  const { loading: loadingConfigs } = useQuery(queries.configs, {
    onCompleted: (data) => {
      setConfigs(data.posclientConfigs)
    },
  })

  useEffect(() => {
    setCurrentUser(data?.posCurrentUser)
  }, [data])

  useEffect(() => {
    const currentConfig = (config || {}).currentConfig

    if (currentConfig) {
      setConfig(currentConfig)
    }

    const { primary } = currentConfig?.uiOptions?.colors || {}

    if (primary) {
      document.documentElement.style.setProperty(
        "--primary",
        hexToHsl(primary || "#4f33af")
      )
    }
  }, [config])

  if (loading || loadingConfig || loadingConfigs)
    return (
      <div className="flex h-screen  items-center justify-center">
        <Loader2 className="mr-2 animate-spin" /> Уншиж байна...
      </div>
    )

  return <>{children}</>
}

export default Configs
