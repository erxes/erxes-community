import { ScrollArea } from "@/components/ui/scroll-area"

import ProductItem from "./components/productItem/productItem.coffeeShop"

const ProductsCoffeShop = () => {
  return (
    <ScrollArea className="w-full pr-3">
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        <ProductItem />
      </div>
    </ScrollArea>
  )
}

export default ProductsCoffeShop
