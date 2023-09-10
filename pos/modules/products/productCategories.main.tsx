"use client"

import { useState } from "react"
import { activeCategoryAtom } from "@/store"
import { useAtomValue } from "jotai"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HorizontalScrollMenu,
  ScrollMenuItem,
} from "@/components/ui/horizontalScrollMenu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { ICategory } from "../../types/product.types"
import CategoriesSheet from "./components/CategoriesSheet"
import CategoryItem from "./components/categoryItem/categoryItem.main"
import ProductCount from "./components/productCount"
import useProductCategories from "./hooks/useProductCategories"

const ProductCategories = () => {
  const { categories, loading } = useProductCategories()
  const activeCat = useAtomValue(activeCategoryAtom)
  const [open, setOpen] = useState(false)

  const getSubCats = (parentOrder: string, tier?: number) =>
    categories.filter(
      ({ order }) =>
        order !== parentOrder &&
        order.includes(parentOrder) &&
        (tier ? (order || "").split("/").length <= tier : true)
    )
  const rootCats = getSubCats("", 3)

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

  const getCategoryByField = (value: string, field: keyof ICategory) =>
    categories.find((e) => e[field] === value)

  return (
    <>
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger asChild>
          <Button className="my-2 mr-2 font-bold" size="sm">
            <MenuIcon className="h-4 w-4 mr-1" strokeWidth={3} />
            {!!activeCat
              ? getCategoryByField(activeCat, "_id")?.name
              : "Ангилал"}
            <ProductCount />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-4xl w-full flex flex-col overflow-hidden h-screen p-4 pr-0"
        >
          <CategoriesSheet
            rootCats={rootCats}
            setOpen={setOpen}
            getCategoryByField={getCategoryByField}
            getSubCats={getSubCats}
          />
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
