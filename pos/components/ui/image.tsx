"use client"

import { FC, memo, useState } from "react"
import NextImage, { ImageProps } from "next/image"
import { cn, readFile } from "lib/utils"
import { Package } from "lucide-react"

const Image: FC<
  ImageProps & {
    src?: string
    alt?: string
    fallBack?: string
    noWrap?: boolean
    withLoader?: boolean
  }
> = (props) => {
  const {
    src,
    fill = true,
    alt = "",
    // onError = () => setSrcI(props.fallBack || "/product.png"),
    width,
    height,
    fallBack,
    noWrap,
    withLoader,
    className,
    ...rest
  } = props
  const fixedSrc = readFile(src || "")
  const [error, setError] = useState(false)

  if (error)
    return (
      <Package
        className={cn("p-4 text-zinc-300", className)}
        strokeWidth={0.8}
      />
    )

  return (
    <NextImage
      height={height}
      width={width}
      alt={alt}
      src={fixedSrc}
      className={className}
      onError={() => setError(true)}
      {...rest}
    />
  )
  // const [isImageLoading, setIsImageLoading] = useState(withLoader)
  // const [srcI, setSrcI] = useState(fixedSrc || fallBack || "/product.png")
  // const handleComplete = () => setIsImageLoading(false)

  // const updatedProps = {
  //   ...rest,
  //   src: srcI,
  //   alt,
  //   fill: !width && !height ? true : undefined,
  //   width,
  //   height,
  //   onError,
  // }

  // const renderImage = () => (
  //   <NextImage
  //     {...updatedProps}
  //     onLoadingComplete={handleComplete}
  //     className={cn(
  //       "next-image",
  //       isImageLoading
  //         ? "skelton-wave next-image-loading"
  //         : "next-image-completed"
  //     )}
  //   />
  // )

  // if (srcI === "/product.png")
  //   return <div className="img-wrap">{/* <ProductFallback /> */}</div>

  // return noWrap ? (
  //   renderImage()
  // ) : (
  //   <div className="img-wrap">{renderImage()}</div>
  // )
}

export default memo(Image)
