import { movementParams } from '../../common/graphql/movement';

export const types = `
    type Movement{
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
`;
export const mutations = `
    assetMovementAdd(assetId:String,assetName:String,userType:String,branchId:String,departmentId:String,companyId:String,customerId:String,teamMemberId:String):JSON
`;
export const queries = `
    assetMovements:[Movement]
    assetMovement(_id:String):Movement
`;
