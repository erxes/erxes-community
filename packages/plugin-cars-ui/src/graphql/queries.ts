import { isEnabled } from '@erxes/ui/src/utils/core';

const carCategoryFields = `
  _id
  name
  order
  code
  parentId
  description

  isRoot
`;

const carFields = `
  _id
  createdAt
  modifiedAt
  ownerId
  owner {
    _id
    details {
      fullName
    }
    email
  }
  mergedIds
  description
  plateNumber
  vinNumber
  categoryId
  category {
    ${carCategoryFields}
  }
  colorCode
  bodyType
  fuelType
  gearBox
  vintageYear
  importYear
`;

const listParamsDef = `
  $page: Int
  $perPage: Int
  $segment: String
  $categoryId: String
  $ids: [String]
  $searchValue: String
  $brand: String
  $sortField: String
  $sortDirection: Int
  $isSelect: Boolean
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  segment: $segment
  categoryId: $categoryId
  ids: $ids
  searchValue: $searchValue
  brand: $brand
  sortField: $sortField
  sortDirection: $sortDirection
  isSelect: $isSelect
`;

export const cars = `
  query cars(${listParamsDef}) {
    cars(${listParamsValue}) {
      ${carFields}
    }
  }
`;

export const carsMain = `
  query carsMain(${listParamsDef}) {
    carsMain(${listParamsValue}) {
      list {
        ${carFields}
      }

      totalCount
    }
  }
`;

export const carCounts = `
  query carCounts(${listParamsDef}, $only: String) {
    carCounts(${listParamsValue}, only: $only)
  }
`;

const carCategories = `
  query carCategories {
    carCategories {
      ${carCategoryFields}
      carCount
    }
  }
`;

const carCategoriesCount = `
  query carCategoriesTotalCount {
    carCategoriesTotalCount
  }
`;

const carCategoryDetail = `
  query carCategoryDetail($_id: String) {
    carCategoryDetail(_id: $_id) {
      ${carCategoryFields}
      carCount
    }
  }
`;

export const carDetail = `
  query carDetail($_id: String!) {
    carDetail(_id: $_id) {
      ${carFields}
      customerIds
      companyIds
      ${
        isEnabled('contacts')
          ? `
            customers {
              _id
              firstName
              lastName
              primaryEmail
              primaryPhone
            }
            companies {
              _id
              names
              website
            }
            `
          : ``
      }
      attachment {
        url
        name
        size
        type
      }
      customFieldsData
    }
  }
`;

export const carsFromCustomer = `
  query carsFromCustomer($customerId: String!) {
    carsFromCustomer(customerId: $customerId) {
      _id
      plateNumber
    }
  }
`;

export const carsFromCompany = `
  query carsFromCompany($customerId: String!) {
    carsFromCompany(customerId: $customerId) {
      _id
      plateNumber
    }
  }
`;

const carsExport = `
  query carsExport(${listParamsDef}) {
    carsExport(${listParamsValue})
  }
`;

export default {
  cars,
  carsMain,
  carCounts,
  carDetail,
  carsExport,
  carCategories,
  carCategoriesCount,
  carCategoryDetail,
  carsFromCustomer,
  carsFromCompany
};
