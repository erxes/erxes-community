import { similarityConfigAtom } from "@/store/config.store"
import { useQuery } from "@apollo/client"
import { useAtomValue } from "jotai"

import { IProduct } from "@/types/product.types"

import { queries } from "../graphql"
import ChooseProperty from "./chooseProperty"
import {
  ProductItemButton,
  ProductItemDescription,
  ProductItemImage,
  ProductItemPriceWithWrapper,
  ProductItemTitle,
} from "./productItem/productItem.coffeeShop"

const ChooseFromSimilarities = (props: IProduct) => {
  const { attachment, name, description, unitPrice, _id } = props
  const groupedSimilarity = useAtomValue(similarityConfigAtom)

  const { data, loading } = useQuery(queries.productSimilarities, {
    variables: {
      id: _id,
      groupedSimilarity,
    },
  })

  return (
    <div className="space-y-3">
      {/* <ProductItemImage src={attachment?.url || ""} />
      <ProductItemTitle>{name}</ProductItemTitle>
      <ProductItemDescription>{description}</ProductItemDescription>
      <ProductItemPriceWithWrapper unitPrice={unitPrice}> */}
      <ProductItemButton>Нэмэх</ProductItemButton>
      {/* </ProductItemPriceWithWrapper> */}
      <ChooseProperty />
      <ChooseProperty />
    </div>
  )
}

export default ChooseFromSimilarities
