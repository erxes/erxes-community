import { performFields } from './queries';

const addParamDefs = `
  $overallWorkId: String
  $overallWorkKey: JSON
  $status: String
  $startAt: Date
  $dueDate: Date
  $endAt: Date
  $count: Float
  $inBranchId: String
  $inDepartmentId: String
  $outBranchId: String
  $outDepartmentId: String
  $needProducts: JobProductsInput
  $resultProducts: JobProductsInput
  $inProducts: JobProductsInput
  $outProducts: JobProductsInput
`;

const addParams = `
  jobType: $jobType,
  jobReferId: $jobReferId,
  productId: $productId,

  inBranchId: $inBranchId,
  inDepartmentId: $inDepartmentId,
  outBranchId: $outBranchId,
  outDepartmentId: $outDepartmentId,
`;

const performAdd = `
  mutation performAdd(${addParamDefs}) {
    performAdd(${addParams}) {
      ${performFields}
    }
  }
`;

const performEdit = `
  mutation performEdit($_id: String!, ${addParamDefs}) {
    performEdit(_id: $_id, ${addParams}) {
      ${performFields}
    }
  }
`;

// const performChange = `
//   mutation performChange($_id: String!, ${commonParamDefs}) {
//     performChange(_id: $_id, ${commonParams}) {
//       ${performFields}
//     }
//   }
// `;

const performRemove = `
  mutation performRemove($_id: String!) {
    performRemove(_id: $_id)
  }
`;

export default {
  performAdd,
  performEdit,
  // performChange,
  performRemove
};
