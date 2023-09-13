import { useState } from "react"
import dynamic from "next/dynamic"

import { IProduct } from "@/types/product.types"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "@/components/ui/image"

const ChooseSimilarities = dynamic(() => import("../ChooseFromSimilarities"), {
  loading: () => <div style={{height: "600px"}}></div>
})

const ProductItem = ({
  attachment,
  name,
  code,
  unitPrice,
  remainder,
  _id,
  description,
}: IProduct) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <div className="border p-4 rounded-md">
          <Image
            src="/cake.jpeg"
            alt=""
            width={200}
            height={200}
            className="w-full object-contain h-24"
            quality={100}
          />
          <CardTitle className="font-extrabold mt-3 mb-2">{name}</CardTitle>
          <div className="text-neutral-500 mb-5">{description || ""}</div>
          <div className="flex items-center justify-between">
            <div className="font-black text-base">
              {unitPrice.toLocaleString()}₮
            </div>
            <Button
              className="bg-green-500 hover:bg-green-400 font-black flex-auto max-w-[5rem] text-sm"
              size={"sm"}
            >
              Нэмэх
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>{open && <ChooseSimilarities />}</DialogContent>
    </Dialog>
  )
}

export default ProductItem
