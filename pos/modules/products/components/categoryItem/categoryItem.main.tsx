import { activeCategoryAtom } from "@/store"
import { useAtom } from "jotai"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CategoryItem = ({ name, _id }: { name: string; _id: string }) => {
  const [activeCat, setActiveCat] = useAtom(activeCategoryAtom)
  return (
    <Button
      variant={activeCat !== _id ? "outline" : undefined}
      size="sm"
      className={cn(
        "my-2 whitespace-nowrap font-bold",
        activeCat !== _id && " text-black/75"
      )}
      onClick={() => setActiveCat(activeCat === _id ? "" : _id)}
    >
      {name}
    </Button>
  )
}

export default CategoryItem
