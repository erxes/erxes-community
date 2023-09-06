"use client"

import { FC, memo, useEffect, useState } from "react"
import NextImage, { ImageLoaderProps, ImageProps } from "next/image"
import { Package } from "lucide-react"

import { cn, readFile } from "@/lib/utils"

const Image: FC<
  ImageProps & {
    src?: string
    alt?: string
    fallBack?: string
    withLoader?: boolean
    contain?: boolean
  }
> = (props) => {
  const {
    src,
    fill = true,
    alt = "",
    onError = () => setSrcI(props.fallBack || "/product.png"),
    width,
    height,
    fallBack,
    withLoader,
    sizes,
    className,
    contain,
    ...rest
  } = props
  const fixedSrc = readFile(src || "")

  const [isImageLoading, setIsImageLoading] = useState(withLoader)
  const [srcI, setSrcI] = useState(fixedSrc || fallBack || "/product.png")
  const handleComplete = () => setIsImageLoading(false)

  useEffect(() => {
    const fixedSrc = readFile(src || "")
    setSrcI(fixedSrc)
  }, [src])

  const updatedProps = {
    ...rest,
    src: srcI,
    alt,
    fill: !width && !height ? true : undefined,
    width,
    height,
    onError,
  }

  if (srcI === "/product.png")
    return (
      <Package
        className={cn("p-4 text-zinc-300", className)}
        strokeWidth={0.8}
      />
    )

  return (
    <NextImage
      {...updatedProps}
      loader={!fixedSrc.startsWith("/") ? cloudflareLoader : undefined}
      onLoadingComplete={handleComplete}
      className={cn(
        "next-image",
        className,
        isImageLoading && "blur-2xl",
        contain ? "object-contain" : "object-contain"
      )}
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
  return `https://erxes.io/cdn-cgi/image/${params.join(",")}/${normalizeSrc(
    src
  )}`
}

//xos.techstore.mn/gateway/read-file?key=0.021508049013006180.51531201349981501.png
const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? process.env.NEXT_PUBLIC_DOMAIN + src : src
}

export default memo(Image)
