import { gql } from "@apollo/client"

const commonFields = `
  _id
  name
  code

`

const productCategories = gql`
  query poscProductCategories ($parentId: String, $searchValue: String, $excludeEmpty: Boolean, $meta: String, $page: Int, $perPage: Int, $sortField: String, $sortDirection: Int) {
    poscProductCategories(parentId: $parentId, searchValue: $searchValue, excludeEmpty: $excludeEmpty, meta: $meta, page: $page, perPage: $perPage, sortField: $sortField, sortDirection: $sortDirection) {
      ${commonFields}
      order
      parentId
      isRoot
    }
  }
`

const products = gql`
  query poscProducts($searchValue: String, $type: String, $categoryId: String, $page: Int, $perPage: Int) {
    poscProducts(searchValue: $searchValue, categoryId: $categoryId, type: $type, page: $page, perPage: $perPage) {
      ${commonFields}
      categoryId
      unitPrice
      type
      description
      remainder
      attachment {
        duration
        name
        size
        type
        url
      }
    }
  }
`

const productsCount = gql`
  query productsCount(
    $categoryId: String
    $type: String
    $searchValue: String
  ) {
    poscProductsTotalCount(
      categoryId: $categoryId
      type: $type
      searchValue: $searchValue
    )
  }
`

const getPriceInfo = gql`
  query getPriceInfo($productId: String!) {
    getPriceInfo(productId: $productId)
  }
`

const queries = { productCategories, products, productsCount, getPriceInfo }
export default queries
