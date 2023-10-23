import gql from 'graphql-tag';

const types = `
  type Msdynamic {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: MsdynamicType
  }

  type MsdynamicType {
    _id: String!
    name: String
  }
`;

const queries = `
  msdynamics(typeId: String): [Msdynamic]
  msdynamicTypes: [MsdynamicType]
  msdynamicsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  msdynamicsAdd(${params}): Msdynamic
  msdynamicsRemove(_id: String!): JSON
  msdynamicsEdit(_id:String!, ${params}): Msdynamic
  msdynamicTypesAdd(name:String):MsdynamicType
  msdynamicTypesRemove(_id: String!):JSON
  msdynamicTypesEdit(_id: String!, name:String): MsdynamicType
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
