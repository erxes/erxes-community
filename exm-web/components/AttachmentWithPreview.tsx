"use client"

import { useState } from "react"
import NextImage from "next/image"

import { readFile } from "@/lib/utils"

export const AttachmentWithPreview = ({ images }: { images: any[] }) => {
  const [visible, setVisible] = useState(false)

  const renderAttachmentPreview = () => {
    return (
      <div className="grid gap-2 mt-2">
        <div className="relative aspect-[5/3]">
          <NextImage
            alt=""
            src={readFile(images[0].url)}
            layout={"fill"}
            className="h-auto max-w-full rounded-lg object-cover cursor-pointer"
            onClick={() => setVisible(true)}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {images.slice(1, images.length).map((image, index) => (
            <div key={index} className="relative aspect-[5/3]">
              <NextImage
                alt=""
                src={readFile(image.url)}
                layout={"fill"}
                className="h-auto max-w-full rounded-lg object-cover cursor-pointer"
                onClick={() => setVisible(true)}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderModal = () => {
    if (!visible) {
      return null
    }

    return <div className="z-10 w-44 h-44 bg-slate-50 fixed">test</div>
  }

  return (
    <>
      {renderAttachmentPreview()}
      {renderModal()}
    </>
  )
}
