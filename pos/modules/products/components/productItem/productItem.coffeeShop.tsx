import Image from "@/components/ui/image"

const ProductItem = () => {
  return (
    <div className="border p-4 rounded-md">
      <Image
        src="/logo-dark.png"
        alt=""
        width={200}
        height={100}
        className="w-full object-contain"
      />
      <h4 className="font-extrabold mt-3 mb-2">Fresh pearl cake #3</h4>
      <small className="text-slate-500">
        Цэвэр сүүн кремтэй хөвсгөр зөөлөн цагаан кекстэй жимсний коктейл
        хавчуургатай гүзээлзгэнэ нэрсээр чимэглэсэн амтат бялууХэмжээ-21см
      </small>
    </div>
  )
}

export default ProductItem
