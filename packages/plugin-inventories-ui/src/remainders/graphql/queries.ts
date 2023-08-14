import { queries as productQueries } from '@erxes/ui-products/src/graphql';

const listParamsDef = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
  $search: String
  $departmentId: String
  $branchId: String
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
  search: $search
  departmentId: $departmentId
  branchId: $branchId
`;

export const remainderProductFields = `
  _id
  name
  type
  code
  unitPrice
  categoryId
  category {
    _id
    code
    name
  }
  remainder
  uom
`;

const remainderProducts = `
  query remainderProducts(
    $categoryId: String,
    $searchValue: String,
    ${listParamsDef}
  ) {
    remainderProducts(
      categoryId: $categoryId,
      searchValue: $searchValue,
      ${listParamsValue}
    ) {
      products {
        ${remainderProductFields}
      }

      totalCount
    }
  }
`;

const remaindersLogs = `
  query remaindersLogs(
    $categoryId: String,
    $productIds: [String]
    $searchValue: String,
    $search: String
    $departmentId: String
    $branchId: String
  ) {
    remaindersLogs(
      categoryId: $categoryId,
      productIds: $productIds,
      searchValue: $searchValue,
      search: $search,
      departmentId: $departmentId,
      branchId: $branchId,
    ) {
      _id
    }
  }
`;

const productCategories = productQueries.productCategories;

export default {
  remainderProducts,
  productCategories,
  remaindersLogs
};
