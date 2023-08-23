export interface IProductBase {
  _id: string
  name: string
  unitPrice: number
  isPackage?: boolean
}

export interface IProduct extends IProductBase {
  categoryId?: string | null
  type?: string | null
  description?: string | null
  attachment?: { url?: string } | null
  remainder?: number
  code?: string
  manufacturedDate?: string
}

export interface IUseProducts {
  loading: boolean
  products: IProduct[]
  productsCount: number
  handleLoadMore: () => void
}
