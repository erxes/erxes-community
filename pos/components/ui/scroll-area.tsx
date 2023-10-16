"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./button"

const ScrollAreaXWithButton = ({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.ScrollAreaProps &
  React.RefAttributes<HTMLDivElement>) => {
  const ref = React.useRef<any>(null)
  const [scrollLeft, setScrollLeft] = React.useState(0)

  const scrollToLeft = () => {
    const scrollLength = ref.current?.offsetWidth / 2
    if (ref.current) {
      ref.current.scrollBy({
        left: -scrollLength,
        behavior: "smooth",
      })
      setScrollLeft(ref.current.scrollLeft - scrollLength)
    }
  }

  const scrollToRight = () => {
    const scrollLength = ref.current?.offsetWidth / 2
    if (ref.current) {
      ref.current.scrollBy({
        left: scrollLength,
        behavior: "smooth",
      })
      setScrollLeft(ref.current.scrollLeft + scrollLength)
    }
  }

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden pr-8", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="w-full rounded-[inherit] h-full"
        ref={ref}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="horizontal" className="mr-8" />
      <ScrollAreaPrimitive.Corner />

      <div className="flex gap-2 flex-col items-center absolute h-full right-0 inset-y-0  rounded-none w-8">
        {scrollLeft > 0 && (
          <Button
            variant="ghost"
            className="flex-auto rounded-none w-full p-0 bg-white"
            onClick={scrollToLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          className="flex-auto rounded-none w-full p-0 bg-white"
          onClick={scrollToRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </ScrollAreaPrimitive.Root>
  )
}
ScrollAreaXWithButton.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollAreaYWithButton = ({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.ScrollAreaProps &
  React.RefAttributes<HTMLDivElement>) => {
  const ref = React.useRef<any>(null)
  const [scrollTop, setScrollTop] = React.useState(0)

  const scrollToTop = () => {
    const scrollHeight = ref?.current.offsetHeight / 2
    if (ref.current) {
      ref.current.scrollBy({
        top: -scrollHeight,
        behavior: "smooth",
      })
      setScrollTop(ref.current.scrollTop - scrollHeight)
    }
  }

  const scrollToDown = () => {
    const scrollHeight = ref.current.offsetHeight / 2
    if (ref.current) {
      ref.current.scrollBy({
        top: scrollHeight,
        behavior: "smooth",
      })
      setScrollTop(ref.current.scrollTop + scrollHeight)
    }
  }

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden pb-12", className)}
      {...props}
      type="always"
    >
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit]"
        ref={ref}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar className="bottom-12 " />
      <ScrollAreaPrimitive.Corner />

      <div className="flex gap-2 items-center absolute w-full left-0 bottom-0 rounded-none">
        {scrollTop > 0 && (
          <Button
            variant="ghost"
            className="flex-auto rounded-none bg-white"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          className="flex-auto rounded-none bg-white"
          onClick={scrollToDown}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </ScrollAreaPrimitive.Root>
  )
}
ScrollAreaYWithButton.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden rounded-xs", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors bg-border rounded",
      orientation === "vertical" && "h-full w-2.5 max-w-[10px] p-[1px]",
      orientation === "horizontal" &&
        "h-1 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        "relative rounded-full bg-black/10",
        orientation === "vertical" && "flex-1"
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar, ScrollAreaYWithButton, ScrollAreaXWithButton }
