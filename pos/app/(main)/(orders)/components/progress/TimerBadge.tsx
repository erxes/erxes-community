import { TimerIcon } from "lucide-react"

import useTimer from "@/lib/useTimer"
import { Badge } from "@/components/ui/badge"

const TimerBadge = ({ createdAt }: { createdAt?: string }) => {
  const { remainingTime } = useTimer(createdAt || "")
  return (
    <Badge variant={"outline"}>
      <TimerIcon className="h-4 w-4 mr-1" />
      {remainingTime}
    </Badge>
  )
}

export default TimerBadge
