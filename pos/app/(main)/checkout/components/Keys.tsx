import { currentAmountAtom } from "@/store"
import { useAtom } from "jotai"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

const Keys = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 9 }).map((_, idx) => (
        <ControlButton key={idx} value={idx + 1} />
      ))}
      <ControlButton value={0} />
      <ControlButton value={"CE"} />
      <ControlButton value={"C"} />
    </div>
  )
}

const ControlButton = ({ value }: { value: string | number }) => {
  const [amount, setAmount] = useAtom(currentAmountAtom)
  const handleClick = () => {
    if (value === "C") return setAmount(0)

    if (value === "CE")
      return setAmount(Number(amount.toString().slice(0, -1) || 0))

    return setAmount(Number(amount.toString() + value))
  }

  return (
    <AspectRatio ratio={1}>
      <Button
        onClick={handleClick}
        className="h-full w-full rounded-full text-lg font-black hover:bg-secondary/10 hover:text-white"
        variant="outline"
      >
        {value}
      </Button>
    </AspectRatio>
  )
}

export default Keys
