"use client"

import { useLazyQuery, useMutation } from "@apollo/client"

import { ButtonProps } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { queries as configQueries } from "../auth/graphql"
import { queries } from "../products/graphql"
import SettingsButton from "./components/Button"
import { mutations } from "./graphql"

const refetchQueries = {
  product: [{ query: queries.products }, "poscP"],
}

const SyncConfig = ({
  configType,
  ...rest
}: ButtonProps & { configType: string }) => {
  const { toast } = useToast()

  const success = () =>
    toast({
      description: `${configType} has been synced successfully.`,
    })
  const [getWholeConfig, { loading: loadingConfig }] = useLazyQuery(
    configQueries.getWholeConfig,
    {
      onCompleted(data) {
        const {} = data?.currentConfig || {}
        success()
      },
    }
  )

  const [syncConfig, { loading, error }] = useMutation(mutations.syncConfig, {
    variables: {
      type: configType,
    },
    onCompleted() {
      if (configType !== "config") {
        return success()
      }
      getWholeConfig()
    },
    onError(error) {
      return toast({ description: error.message, variant: "destructive" })
    },
    refetchQueries: [],
  })

  const handleClick = () => syncConfig()
  return (
    <SettingsButton
      {...rest}
      onClick={handleClick}
      loading={loading || loadingConfig}
    />
  )
}

export default SyncConfig
