export const types = `
  type PosCoverSummary {
    _id: String
    kind: String
    kindOfVal: Float
    amount: Float
  }

  type PosCoverDetail {
    _id: String
    paidType: String
    
    paidSummary: [PosCoverSummary]
    paidDetail: JSON
  }

  type PosCover {
    _id: String
    posToken: String
    beginDate: Date
    endDate: Date
    description: String
    userId: String
    details: [PosCoverDetail]
    createdAt: Date
    createdBy: String
    modifiedAt: Date
    modifiedBy: String

    user: User
    createdUser:  User
    modifiedUser:  User
  }
`;

const coverParams = `
  note: String
`;

export const mutations = `
  posCoversEdit(_id: String!, ${coverParams}): PosCover
  posCoversRemove(_id: String!): String
`;

export const queries = `
  posCovers(startDate: Date, endDate: Date, userId: String): [PosCover]
  posCoverDetail(_id: String!): PosCover
`;
