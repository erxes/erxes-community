"use client"

import { useState } from "react"
import NextImage from "next/image"

import { cn, readFile } from "@/lib/utils"

export const AttachmentWithPreview = ({
  images,
  className,
}: {
  images: any[]
  className?: string
}) => {
  const [index, setIndex] = useState(0)

  const renderAttachmentPreview = () => {
    const handleClick = (type: string) => {
      if (type === "previous" && index > 0) {
        setIndex(index - 1)
      }

      if (type === "next" && index < images.length - 1) {
        setIndex(index + 1)
      }
    }

    return (
      <div id="gallery" className={cn("relative w-full", className)}>
        <div className="relative h-56 overflow-hidden md:h-96">
          <div className="relative aspect-[5/3]" data-carousel-item={true}>
            <NextImage
              alt=""
              src={readFile(images[index].url)}
              layout={"fill"}
              className="h-auto max-w-full object-contain cursor-pointer"
            />
          </div>
        </div>

        {index > 0 && (
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
            onClick={() => handleClick("previous")}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C3C3C1]">
              <svg
                className="w-2.5 h-2.5 text-white dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
        )}

        {index < images.length - 1 && (
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={() => handleClick("next")}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C3C3C1]">
              <svg
                className="w-2.5 h-2.5 text-white dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        )}
      </div>
    )
  }

  return <>{renderAttachmentPreview()}</>
}
