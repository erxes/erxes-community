import { movementFilters, movementParams } from '../../common/graphql/movement';

export const types = `
    type MovementAsset{
        _id:String,
        assetName:String,
        assetId:String,
        userType:String,
        branchId:String,
        departmentId:String,
        customerId:String,
        teamMemberId:String,
        companyId:String,
        createdAt:String

        customer:JSON
        company:JSON
        branch:JSON
        teamMember:JSON
        department:JSON
    }

    type Movement {
        _id:String
        createdAt:String
        assetIds:[String]

        assets:[MovementAsset]
    }

    input IMovementAsset {
        assetId:String,
        assetName:String,
        userType:String,
        branchId:String,
        departmentId:String,
        companyId:String,
        customerId:String,
        teamMemberId:String
    }
`;
export const mutations = `
    assetMovementAdd(movements:[IMovementAsset]):JSON
    assetMovementRemove:JSON
`;
export const queries = `
    assetMovements(${movementFilters}):[Movement]
    assetMovementTotalCount:Int
    assetMovement(_id:String):Movement
    assetMovementAssets(${movementFilters}):[MovementAsset]
    assetMovementItemsTotalCount:Int
    assetMovementAsset(_id:String):MovementAsset
`;
