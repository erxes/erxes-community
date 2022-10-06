import { movementParams, movementParamsDef } from '../../common/graphql/movement';

const movementAdd = `
    mutation AssetMovementAdd(${movementParamsDef}) {
        assetMovementAdd(${movementParams})
    }
`;
const movementEdit = `
`;
export default { movementAdd, movementEdit };
