"use client"

import { useMutation } from "@apollo/client"

import { ButtonProps } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { queries } from "../products/graphql"
import SettingsButton from "./components/Button"
import { mutations } from "./graphql"

const refetchQueries = {
  product: [{ query: queries.products }, 'poscP'],
}

const SyncConfig = ({
  configType,
  ...rest
}: ButtonProps & { configType: string }) => {
  const { toast } = useToast()
  const [syncConfig, { loading, error }] = useMutation(mutations.syncConfig, {
    variables: {
      type: configType,
    },
    onCompleted(data) {
      return toast({
        description: `${configType} has been synced successfully.`,
      })
    },
    onError(error) {
      return toast({ description: error.message, variant: "destructive" })
    },
    refetchQueries: [],
  })

  const handleClick = () => syncConfig()
  return <SettingsButton {...rest} onClick={handleClick} loading={loading} />
}

export default SyncConfig
