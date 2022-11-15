const discountAdd = `
  mutation DiscountAdd($doc: DiscountAddInput) {
    discountAdd(doc: $doc) {
      _id
      name
      status
      amountValue
      amountType
      products
      productCategories
      productsExcluded
  
      quantityType
      quantityValue
      minPurchaseEnabled
      minPurchaseValue
  
      departmentIds
      branchIds
      unitIds
  
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }
`;

const discountRemove = `
  mutation DiscountRemove($id: String) {
    discountRemove(id: $id) {
      _id
    }
  }
`;

export default {
  discountAdd,
  discountRemove
};
