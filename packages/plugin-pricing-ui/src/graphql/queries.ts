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
      type
      value
      bonusProduct

      applyType

      products
      productsExcluded
      categories
      categoriesExcluded

      isStartDateEnabled
      isEndDateEnabled

      startDate
      endDate

      branchIds
      departmentIds
      boardId
      pipelineId
      stageId

      isQuantityEnabled
      quantityRules {
        type
        typeValue
        discountValue
      }

      isPriceEnabled
      priceRules {
        type
        typeValue
        discountValue
      }

      isExpiryEnabled
      expiryRules {
        type
        typeValue
        discountValue
      }

      isRepeatEnabled
      repeatRules {
        type
        value
      }
    }
  }
`;

export default {
  discounts,
  discountDetail
};
