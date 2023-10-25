import React from "react"
import { XCircleIcon } from "lucide-react"

const ReplyInfo = ({
  reply,
  setReply,
}: {
  reply: any
  setReply: (reply: any) => void
}) => {
  if (reply) {
    return (
      <div className="flex flex-col px-4 py-2 bg-white border-t-2 text-xs text-[#444]">
        <div className="flex justify-between">
          <p>
            Replying to{" "}
            <b>
              {reply?.createdUser?.details?.fullName ||
                reply?.createdUser?.email}
            </b>
          </p>
          <XCircleIcon
            className="cursor-pointer"
            size={18}
            onClick={() => setReply(null)}
          />
        </div>
        <p className="max-w-md overflow-hidden truncate">{reply.content}</p>
      </div>
    )
  } else {
    return <></>
  }
}

export default ReplyInfo
