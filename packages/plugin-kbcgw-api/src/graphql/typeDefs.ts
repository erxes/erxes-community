import { gql } from 'apollo-server-express';

const types = `
  type Kbcgw {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: KbcgwType
  }

  type KbcgwType {
    _id: String!
    name: String
  }
`;

const queries = `
  kbcgws(typeId: String): [Kbcgw]
  kbcgwTypes: [KbcgwType]
  kbcgwsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  kbcgwsAdd(${params}): Kbcgw
  kbcgwsRemove(_id: String!): JSON
  kbcgwsEdit(_id:String!, ${params}): Kbcgw
  kbcgwTypesAdd(name:String):KbcgwType
  kbcgwTypesRemove(_id: String!):JSON
  kbcgwTypesEdit(_id: String!, name:String): KbcgwType
`;

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${types}
    
    extend type Query {
      ${queries}
    }
    
    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;
