"use client"

import { FC, memo, useEffect, useState } from "react"
import NextImage, { ImageLoaderProps, ImageProps } from "next/image"
import { Package } from "lucide-react"

import { cn, readFile } from "@/lib/utils"

const Avatar: FC<
  ImageProps & {
    src?: string
    alt?: string
    fallBack?: string
  }
> = (props) => {
  const {
    src,
    fill = true,
    alt = "",
    onError = () => setFixedSrc(props.fallBack || "/user.png"),
    width,
    height,
    fallBack,
    sizes,
    className,
    ...rest
  } = props
  const [fixedSrc, setFixedSrc] = useState(readFile(src || ""))

  const [isImageLoading, setIsImageLoading] = useState(true)
  const handleComplete = () => setIsImageLoading(false)

  const updatedProps = {
    ...rest,
    src: fixedSrc,
    alt,
    fill: !width && !height ? true : undefined,
    width,
    height,
    onError,
  }

  return (
    <NextImage
      {...updatedProps}
      onLoadingComplete={handleComplete}
      className={cn(className, isImageLoading && "blur-2xl", "text-black")}
      sizes={
        sizes ||
        `(max-width: 768px) 20vw,
  (max-width: 1200px) 15vw,
  15vw`
      }
    />
  )
}

export function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [`width=${width}`, `quality=${quality || 75}`, "format=auto"]
  return `https://erxes.io/cdn-cgi/image/${params.join(",")}/${src}`
}

export default memo(Avatar)
