const commonFields = `
number
type
currency
status
balance
name
holdBalance
availableBalance
`;

const listQuery = `
query KhanbankAccounts($configId: String!) {
    khanbankAccounts(configId: $configId) {
        ${commonFields}
    }
  }
`;

export default {
  listQuery
};
