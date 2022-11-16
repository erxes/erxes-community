const discountAdd = `
  mutation DiscountAdd($doc: DiscountAddInput) {
    discountAdd(doc: $doc) {
      _id
      name
      status
      amountValue
      amountType

      applyType

      products
      productsExcluded
      categories
      categoriesExcluded
  
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

const discountEdit = `
  mutation DiscountEdit($doc: DiscountEditInput) {
    discountEdit(doc: $doc) {
      _id
      name
      status
      amountValue
      amountType

      applyType

      products
      productsExcluded
      categories
      categoriesExcluded
  
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
  discountEdit,
  discountRemove
};
