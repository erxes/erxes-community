const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

export const meetingFilters = `
    companyId:String,
    createdAtFrom:String,
    createdAtTo:String,
    searchValue:String
    userId:String,
    participantIds: [String]
    dealIds: [String]
    isPreviousSession: Boolean
    perPage: Int
    page: Int
`;

export const queries = `
  msdynamics(typeId: String): [Msdynamic]
  msdynamicsTotalCount: Int
`;

export const mutations = `
  msdynamicsAdd(${params}): Msdynamic
  msdynamicsRemove(_id: String!): JSON
  msdynamicsEdit(_id:String!, ${params}): Msdynamic
`;
