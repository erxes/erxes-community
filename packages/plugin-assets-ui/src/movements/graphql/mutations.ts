import { movementParams, movementParamsDef } from '../../common/graphql/movement';

const movementAdd = `
mutation AssetMovementAdd($movedAt:String,$description:String,$movements: [IMovementAsset]) {
  assetMovementAdd(movedAt:$movedAt,description:$description,movements: $movements)
}

`;
const movementRemove = `
mutation Mutation {
  assetMovementRemove
}
`;
export default { movementAdd, movementRemove };
