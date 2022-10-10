import { movementParams, movementParamsDef } from '../../common/graphql/movement';

const movementAdd = `
mutation AssetMovementAdd($movements: [IMovementAsset]) {
  assetMovementAdd(movements: $movements)
}

`;
const movementRemove = `
mutation Mutation {
  assetMovementRemove
}
`;
export default { movementAdd, movementRemove };
