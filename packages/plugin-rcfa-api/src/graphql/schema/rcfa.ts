export const types = `
  type rcfaType {
    _id: String
    mainType: String
    mainTypeId: String
    relType: String
    relTypeId: String
    status: String
    createdAt: Date
    createdUser: String
    closedAt: Date
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

export const mutations = `
`;
