import React, { useState } from "react"
import { Image as ImageIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import uploadHandler from "@/components/uploader/uploadHandler"

import AttachmentsPreview from "./AttachmentsPreview"

export interface IAttachment {
  name: string
  type: string
  url: string
  size?: number
}

type Props = {
  defaultFileList: IAttachment[]
  onChange: (attachments: IAttachment[]) => void
  single?: boolean
  limit?: number
  multiple?: boolean
  type?: string
}

const Uploader = ({
  defaultFileList,
  onChange,
  single,
  limit,
  multiple,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState(defaultFileList || [])

  const handleFileInput = ({ target }: { target: any }) => {
    const files = target.files

    uploadHandler({
      files,

      beforeUpload: () => {
        setLoading(true)
      },

      afterUpload: ({ status, response, fileInfo }) => {
        if (status !== "ok") {
          console.log(response)

          return setLoading(false)
        }

        const attachment = { url: response, ...fileInfo }

        setAttachments([...attachments, attachment])

        onChange(attachments)

        setLoading(false)
      },
    })

    target.value = ""
  }

  return (
    <Card className="bg-[#F0F0F0]">
      <div className="flex items-center space-x-2">
        <label
          htmlFor="file-input"
          className="cursor-pointer px-4 py-2  h-[50%] w-full flex items-center"
        >
          <ImageIcon />
        </label>
        <input
          id="file-input"
          accept="image/*"
          type="file"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </Card>
  )
}

export default Uploader
