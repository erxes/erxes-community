import React from "react"

import uploadHandler from "@/components/uploader/uploadHandler"

export interface IAttachment {
  name: string
  type: string
  url: string
  size?: number
}

const AttachmentsPreview = ({
  attachment,
  removeAttachment,
}: {
  attachment: IAttachment
  removeAttachment: any
}) => {
  console.log(attachment, removeAttachment)
  return <div>12312</div>
}

export default AttachmentsPreview
