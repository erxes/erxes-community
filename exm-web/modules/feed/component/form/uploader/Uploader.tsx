import React, { useEffect, useState } from "react"
import { Image as ImageIcon, Paperclip } from "lucide-react"

import { Card } from "@/components/ui/card"
import uploadHandler from "@/components/uploader/uploadHandler"

export interface IAttachment {
  name: string
  type: string
  url: string
  size?: number
}

type Props = {
  defaultFileList: IAttachment[]
  onChange: (attachments: IAttachment[]) => void
  type?: string
}

const Uploader = ({ defaultFileList, onChange, type }: Props) => {
  const [loading, setLoading] = useState(false)

  const handleFileInput = ({ target }: { target: any }) => {
    const files = target.files

    uploadHandler({
      files,

      beforeUpload: () => {
        setLoading(true)
      },

      afterUpload: ({ status, response, fileInfo }) => {
        if (status !== "ok") {
          return setLoading(false)
        }

        const attachment = { url: response, ...fileInfo }

        const updated = [...defaultFileList, attachment]

        onChange(updated)

        setLoading(false)
      },
    })

    target.value = ""
  }

  const uploadText =
    type && type === "image" ? "Upload images" : "Upload Attachments"

  const uploIcon = type && type === "image" ? <ImageIcon /> : <Paperclip />

  const id = Math.random().toString()

  return (
    <Card className="bg-[#F0F0F0]">
      <div className="flex items-center space-x-2">
        <label
          htmlFor={id}
          className="cursor-pointer px-4 py-2  h-[50%] w-full flex items-center"
        >
          {uploIcon}
          <p>{uploadText}</p>
        </label>
        <input
          id={id}
          accept={type && type === "image" ? "image/*" : ""}
          type="file"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {loading ? <div> Uploading</div> : null}
    </Card>
  )
}

export default Uploader
