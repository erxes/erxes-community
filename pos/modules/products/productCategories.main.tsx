"use client"

import { useState } from "react"
import { activeCategoryAtom } from "@/store"
import { useAtom } from "jotai"
import { ChevronRightIcon, MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HorizontalScrollMenu,
  ScrollMenuItem,
} from "@/components/ui/horizontalScrollMenu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import CategoryItem from "./components/categoryItem/categoryItem.main"
import useProductCategories from "./hooks/useProductCategories"

const ProductCategories = () => {
  const { categories, loading } = useProductCategories()
  const [activeCat, setActiveCat] = useAtom(activeCategoryAtom)
  const [open, setOpen] = useState(false)

  if (loading)
    return (
      <div className="flex flex-auto items-center gap-3 overflow-hidden">
        {Array.from({ length: 9 }).map((el, idx) => (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-black/75"
            disabled
            key={idx}
          >
            <Skeleton className="h-4 w-16" />
          </Button>
        ))}
      </div>
    )

  const rootCats = categories.filter(
    (e) => (e.order || "").split("/").length === 2
  )

  return (
    <>
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger asChild>
          <Button
            className="my-2 mr-2 font-bold text-black/75"
            size="sm"
            variant={"outline"}
          >
            <MenuIcon className="h-4 w-4 mr-1" strokeWidth={2} />
            Ангилал
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-2xl flex flex-col overflow-hidden h-screen"
        >
          <SheetHeader className="flex-none">
            <SheetTitle>Ангилал</SheetTitle>
          </SheetHeader>
          <ScrollArea className="overflow-hidden max-h-full">
            <div className="space-y-1">
              {categories.map((e) => (
                <Button
                  variant={activeCat === e._id ? "default" : "outline"}
                  className="justify-between text-xs w-full "
                  key={e._id}
                  size="sm"
                  style={{
                    paddingLeft:
                      16 * ((e.order || "").split("/").length - 2) + 12,
                  }}
                  onClick={() => {
                    setActiveCat(activeCat === e._id ? "" : e._id)
                    setOpen(false)
                  }}
                >
                  {e.name}
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <HorizontalScrollMenu separatorClassName="w-2 flex-none">
        {rootCats.map(({ _id, name }) => (
          <ScrollMenuItem itemId={_id} key={_id}>
            <CategoryItem _id={_id} name={name} />
          </ScrollMenuItem>
        ))}
      </HorizontalScrollMenu>
    </>
  )
}

export default ProductCategories
