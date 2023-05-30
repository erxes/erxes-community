import { gql } from 'apollo-server-express';

const types = `
  type Osm {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: OsmType
  }

  type OsmType {
    _id: String!
    name: String
  }
`;

const queries = `
  osms(typeId: String): [Osm]
  osmTypes: [OsmType]
  osmsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  osmsAdd(${params}): Osm
  osmsRemove(_id: String!): JSON
  osmsEdit(_id:String!, ${params}): Osm
  osmTypesAdd(name:String):OsmType
  osmTypesRemove(_id: String!):JSON
  osmTypesEdit(_id: String!, name:String): OsmType
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
