import { movementFilters, movementParams } from '../../common/graphql/movement';

export const types = `
    type MovementItem{
        _id:String,
        assetName:String,
        assetId:String,
        userType:String,
        branchId:String,
        departmentId:String,
        customerId:String,
        movementId:String,
        teamMemberId:String,
        companyId:String,
        createdAt:Date

        customer:JSON
        company:JSON
        branch:JSON
        teamMember:JSON
        department:JSON
    }

    type Movement {
        _id:String
        createdAt:Date
        modifiedAt:Date
        userId:String
        movedAt:Date
        assetIds:[String]
        description:String
        
        user:JSON
        selectedItems:JSON
        assets:[MovementItem]
    }

    input IMovementItem {
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
    assetMovementAdd(movedAt:String,description:String,items:[IMovementItem]):JSON
    assetMovementUpdate(_id: String,doc:JSON):JSON
    assetMovementRemove(ids:[String]):JSON
`;
export const queries = `
    assetMovements(${movementFilters}):[Movement]
    assetMovementTotalCount(${movementFilters}):Int
    assetMovement(_id:String):Movement
    assetMovementItems(${movementFilters}):[MovementItem]
    assetMovementItemsTotalCount(${movementFilters}):Int
    assetMovementItem(_id:String):MovementItem
`;
