"use client"

import { ChevronRightIcon, MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HorizontalScrollMenu,
  ScrollMenuItem,
} from "@/components/ui/horizontalScrollMenu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import CategoryItem from "./components/categoryItem/categoryItem.main"
import useProductCategories from "./hooks/useProductCategories"

const ProductCategories = () => {
  const { categories, loading } = useProductCategories()

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

  return (
    <>
      <Sheet>
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
        <SheetContent side="left" className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Ангилал</SheetTitle>
          </SheetHeader>
          <div className="flex">
            <div className="space-y-2 py-4 w-1/3">
              {categories.map((e) => (
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs"
                  key={e._id}
                >
                  {e.name}
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <HorizontalScrollMenu separatorClassName="w-2 flex-none">
        {categories.map(({ _id, name }) => (
          <ScrollMenuItem itemId={_id} key={_id}>
            <CategoryItem _id={_id} name={name} />
          </ScrollMenuItem>
        ))}
      </HorizontalScrollMenu>
    </>
  )
}

export default ProductCategories
