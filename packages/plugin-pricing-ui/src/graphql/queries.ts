const pricingPlans = `
  query PricingPlans($status: String) {
    pricingPlans(status: $status) {
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

const pricingPlanDetail = `
  query PricingPlanDetail($id: String) {
    pricingPlanDetail(id: $id) {
      _id
      name
      status
      type
      value
      bonusProduct
      isPriority

      applyType

      products
      productsExcluded
      productsBundle
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
        value
        discountType
        discountValue
        discountBonusProduct
      }

      isPriceEnabled
      priceRules {
        type
        value
        discountType
        discountValue
        discountBonusProduct
      }

      isExpiryEnabled
      expiryRules {
        type
        value
        discountType
        discountValue
        discountBonusProduct
      }

      isRepeatEnabled
      repeatRules {
        type
        dayStartValue
        dayEndValue
        weekValue {
          label
          value
        }
        monthValue {
          label
          value
        }
        yearStartValue
        yearEndValue
      }
    }
  }
`;

export default {
  pricingPlans,
  pricingPlanDetail
};
