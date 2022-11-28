const discountAdd = `
  mutation DiscountAdd($doc: DiscountAddInput) {
    discountAdd(doc: $doc) {
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
