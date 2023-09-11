import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import Image from "@/components/ui/image"

import ChooseProperty from "./chooseProperty"

const ChooseFromSimilarities = () => {
  return (
    <div className="space-y-3">
      <Image
        src="/cake.jpeg"
        alt=""
        width={400}
        height={400}
        className="w-full object-contain h-48"
        quality={100}
      />
      <CardTitle className="font-extrabold text-base pt-1">
        Fresh pearl cake #3
      </CardTitle>
      <div className="text-neutral-500 mb-3">
        Цэвэр сүүн кремтэй хөвсгөр зөөлөн цагаан кекстэй жимсний коктейл
        хавчуургатай гүзээлзгэнэ нэрсээр чимэглэсэн амтат бялууХэмжээ-21см
      </div>
      <div className="flex items-center justify-between">
        <div className="font-black text-base">65,000₮</div>
        <Button
          className="bg-green-500 hover:bg-green-400 font-black flex-auto max-w-[5rem] text-sm"
          size={"sm"}
        >
          Нэмэх
        </Button>
      </div>
      <ChooseProperty />
      <ChooseProperty />
    </div>
  )
}

export default ChooseFromSimilarities
