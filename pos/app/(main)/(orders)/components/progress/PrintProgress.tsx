import { showRecieptAtom } from "@/store/progress.store"
import { useAtom, useAtomValue } from "jotai"

import useReciept from "@/lib/useReciept"

const PrintProgress = () => {
  const [showRecieptId, setShowRecieptId] = useAtom(showRecieptAtom)
  const { iframeRef } = useReciept({
    onCompleted() {
      console.log("------")
      setShowRecieptId(null)
    },
  })
  return (
    <>
      {!!showRecieptId && (
        <iframe
          ref={iframeRef}
          className="absolute h-1 w-1"
          style={{ top: 10000, left: 10000 }}
          src={`/reciept/progress/${showRecieptId}`}
        />
      )}
    </>
  )
}

export default PrintProgress
