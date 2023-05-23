export const types = `
  type rcfaType {
    _id: String
    mainType: String
    mainTypeId: String
    relType: String
    relTypeId: String
    status: String
    createdAt: Date
    userId: String
    closedAt: Date

    issues:[RCFAIssue]
  }

  type rcfaListQueryResponse {
    list: [rcfaType]
    totalCount: Int
  }
`;

export const queries = `
  rcfaList(perPage:Int, page:Int, searchValue:String, mainType:String): rcfaListQueryResponse
  rcfaDetail(_id:String, mainType:String, mainTypeId:String): JSON
`;

const commonMutationParams = `
  mainType:String,
  mainTypeId:String,
  destinationType:String,
  destinationStageId:String
`;

export const mutations = `
  resolveRCFA(${commonMutationParams}):rcfaType
`;
