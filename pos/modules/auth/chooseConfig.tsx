import { configAtom, configsAtom } from "@/store/config.store"
import { useMutation } from "@apollo/client"
import { useAtom } from "jotai"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { mutations, queries } from "./graphql"

const ChooseConfig = () => {
  const [config] = useAtom(configAtom)
  const [configs] = useAtom(configsAtom)
  const [chooseConfig, { loading }] = useMutation(mutations.chooseConfig, {
    refetchQueries: [{ query: queries.currentConfig }, "currentConfig"],
  })

  const handleChange = (value: string) => {
    return chooseConfig({ variables: { token: value } })
  }

  if (!configs || configs.length < 2) return null

  return (
    <div className="mb-3 space-y-1">
      <Label>Choose pos</Label>
      <Select
        disabled={loading}
        value={config?.token}
        onValueChange={handleChange}
      >
        <SelectTrigger loading={loading}>
          <SelectValue placeholder="сонгох" />
        </SelectTrigger>
        <SelectContent>
          {(configs || []).map(({ token, name }: any) => (
            <SelectItem key={token} value={token}>
              {name} - {token}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ChooseConfig
