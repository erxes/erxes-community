import { gql } from 'apollo-server-express';

const types = `
  type OSMAddress {
    fullAddress: String

    country: String
    countryCode: String
    city: String
    district: String
    quarter: String
    road: String
    state: String
    postcode: String
    houseNumber: String

    lat: Float
    lng: Float

    osmId: String
    osmType: String
    boundingbox: [String]
  }

  input Location {
    lat: Float
    lng: Float
  }

  enum RouteProfile {
    car
    bike
    foot
  }
`;

const routeParams = `
  start: Location!
  end: Location!

  profile: RouteProfile

  alternatives: Int
  steps: Boolean
  annotations: Boolean
  geometries: String
  overview: String

`;

const queries = `
  osmReverseGeoLocation(location: Location!, language: String): OSMAddress
  osmSearchAddress(query: String!, language: String): [OSMAddress]

  osmFindRoutes(${routeParams}): JSON
`;

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${types}
    
    extend type Query {
      ${queries}
    }
  `;
};

export default typeDefs;
