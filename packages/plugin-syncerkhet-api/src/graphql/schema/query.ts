const commonParams = `
  perPage: Int,
  page: Int 
`;
export const queries = `
  getCategoriesErkhet(${commonParams}): [CategoryResponse]
  getProductsErkhet(${commonParams}): [ProductResponse]
  toCheckProducts(productCodes: [String]): JSON
  toCheckCategories(categoryCodes: [String]): JSON
`;
