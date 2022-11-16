const discounts = `
  query discounts($status: String) {
    discounts(status: $status) {
      _id
      name
      status
      createdAt
      createdBy
      updatedAt
      updatedBy
      createdUser {
        details {
          fullName
        }
      }
      updatedUser {
        details {
          fullName
        }
      }
    }
  }
`;

const discountDetail = `
  query DiscountDetail($id: String) {
    discountDetail(id: $id) {
      _id
      name
      status
      amountType
      amountValue

      applyType

      products
      productsExcluded
      categories
      categoriesExcluded

      quantityType
      quantityValue
      minPurchaseEnabled
      minPurchaseValue
      
      branchIds
      departmentIds
      unitIds
    }
  }
`;

export default {
  discounts,
  discountDetail
};
