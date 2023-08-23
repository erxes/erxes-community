"use client"

import { Button } from "@/components/ui/button"
import {
  HorizontalScrollMenu,
  ScrollMenuItem,
} from "@/components/ui/horizontalScrollMenu"
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
    <HorizontalScrollMenu separatorClassName="w-2 flex-none">
      {categories.map(({ _id, name }) => (
        <ScrollMenuItem itemId={_id} key={_id}>
          <CategoryItem _id={_id} name={name} />
        </ScrollMenuItem>
      ))}
    </HorizontalScrollMenu>
  )
}

export default ProductCategories
