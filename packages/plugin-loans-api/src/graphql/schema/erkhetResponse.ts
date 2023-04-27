export const types = () => {
  return `
  type EbarimtResponse {
    _id: String!
    createdAt: Date
    contractId: String
    transactionId: String
    data: JSON
  }

  type EbarimtYearsResponse {
    year: Float
  }
`;
};

const queryParams = `
  contractId: String
  year: Float
  startDate: Date
  endDate: Date
  transactionId: String
  cpUserType: String
  cpUserEmail: String
  cpUserPhone: String
`;

export const queries = `
  cpEbarimts(${queryParams}): [EbarimtResponse]
  cpEbarimtYears(cpUserType: String cpUserEmail: String cpUserPhone: String): [EbarimtYearsResponse]
`;
