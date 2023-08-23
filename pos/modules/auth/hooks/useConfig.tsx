import {
  coverConfigAtom,
  setCoverConfigAtom,
  setEbarimtConfigAtom,
} from "@/store/config.store"
import { useQuery } from "@apollo/client"
import { useAtom } from "jotai"

import { IConfig, IPaymentConfig } from "@/types/config.types"

import { queries } from "../graphql"

const queryObject = {
  main: queries.currentConfig,
  payment: queries.getPaymentConfig,
  settings: queries.getSettingsConfig,
  ebarimt: queries.getEbarimtConfig,
  cover: queries.getCoverConfig,
}

const useConfig = (
  type: "payment" | "settings" | "main" | "ebarimt" | "cover",
  options?: {
    onCompleted?: (data: IConfig & IPaymentConfig) => void
    skip?: boolean
  }
  // todo: ts stick
): {
  config: any
  loading: boolean
} => {
  const { onCompleted, skip } = options || {}
  const [, setEbarimtConfig] = useAtom(setEbarimtConfigAtom)
  const [, setCoverConfig] = useAtom(setCoverConfigAtom)
  const { data, loading } = useQuery(queryObject[type], {
    onCompleted({ currentConfig }) {
      if (type === "ebarimt") {
        setEbarimtConfig(currentConfig)
      }
      if (type === "cover") {
        setCoverConfig(currentConfig)
      }
      onCompleted && onCompleted(currentConfig)
    },
    skip: !type || skip,
  })

  const { currentConfig: config } = data || {}

  return { config: config || {}, loading }
}

export default useConfig
